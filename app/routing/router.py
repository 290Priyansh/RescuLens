from app.routing.hospitals import HOSPITALS
from app.routing.severity_rules import SEVERITY_CAPABILITY_MAP
from app.utils.geo import haversine


def recommend_hospitals(location, severity):
    required_caps = SEVERITY_CAPABILITY_MAP.get(severity, [])
    recommendations = []

    for h in HOSPITALS:
        if h["beds"] <= 0:
            continue

        if not any(cap in h["capabilities"] for cap in required_caps):
            continue

        distance = haversine(
            location.lat, location.lon,
            h["lat"], h["lon"]
        )

        score = (
            (1 / (distance + 1)) * 0.6 +
            (h["beds"] / 10) * 0.4
        )

        recommendations.append({
            "hospital": h,
            "score": score
        })

    recommendations.sort(key=lambda x: x["score"], reverse=True)

    if recommendations:
        chosen = recommendations[0]["hospital"]
        chosen["beds"] -= 1   # 🔥 CONSUME BED

        return [{
            "name": chosen["name"],
            "score": round(recommendations[0]["score"], 2),
            "reason": f"Assigned ({severity}); remaining beds: {chosen['beds']}"
        }]

    return []

