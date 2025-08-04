class ApiResponse:
    def __init__(self, status_code, payload=None, message=""):
        self.status_code = status_code
        self.payload = payload
        self.message = message
        self.success = status_code < 400

    def to_dict(self):
        return {
            "statusCode": self.status_code,
            "payload": self.payload,
            "message": self.message,
            "success": self.success
        }
