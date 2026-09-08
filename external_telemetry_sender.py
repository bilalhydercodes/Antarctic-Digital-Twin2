import json
import urllib.request
import time
import sys

def send_telemetry(station="MAITRI", sensor_id="AWS-001", temperature=-45.0, wind_speed=35.0, humidity=55.0, pressure=978.0):
    url = "http://localhost:5000/api/telemetry/ingest"
    payload = {
        "station": station,
        "sensorId": sensor_id,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "data": {
            "temperature": temperature,
            "windSpeed": wind_speed,
            "humidity": humidity,
            "pressure": pressure
        }
    }
    
    data_bytes = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data_bytes, headers={'Content-Type': 'application/json'})
    
    print(f"🚀 Sending External Telemetry Payload to {url}:")
    print(json.dumps(payload, indent=2))
    
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode('utf-8')
            print("\n🟢 Server Response:")
            print(json.dumps(json.loads(res_body), indent=2))
    except Exception as e:
        print(f"\n🔴 Failed to send telemetry: {e}")

if __name__ == "__main__":
    station = sys.argv[1] if len(sys.argv) > 1 else "MAITRI"
    temp = float(sys.argv[2]) if len(sys.argv) > 2 else -45.0
    wind = float(sys.argv[3]) if len(sys.argv) > 3 else 35.0
    
    send_telemetry(station=station, temperature=temp, wind_speed=wind)
