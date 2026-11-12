import asyncio

import httpx

from app.main import app


def test_health_returns_service_status() -> None:
    async def get_health() -> httpx.Response:
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(
            transport=transport,
            base_url="http://testserver",
        ) as client:
            return await client.get("/api/health")

    response = asyncio.run(get_health())

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "familyofsix-api",
    }
