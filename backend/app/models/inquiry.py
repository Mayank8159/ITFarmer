def inquiry_serializer(inquiry) -> dict:
    return {
        "id": str(inquiry["_id"]),
        "name": inquiry["name"],
        "company": inquiry.get("company"),
        "email": inquiry["email"],
        "budget": inquiry.get("budget"),
        "service": inquiry["service"],
        "date": str(inquiry["date"]),
        "time": str(inquiry["time"]),
        "message": inquiry["message"],
    }
