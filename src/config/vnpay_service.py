# src/config/firebase/vnpay_service.py

import hmac
import hashlib
import random
from datetime import datetime, timedelta
from urllib.parse import quote_plus
from flask import request

from .vnpay_config import (
    vnp_PayUrl,
    vnp_TmnCode,
    vnp_HashSecret,
    vnp_Returnurl,
)

def hmacSHA512(key, data):
    return hmac.new(key.encode("utf-8"), data.encode("utf-8"), hashlib.sha512).hexdigest()

def hashAllFields(fields):
    sortedFields = sorted(fields)
    queryStr = "&".join(f"{key}={fields[key]}" for key in sortedFields)
    return hmacSHA512(vnp_HashSecret, queryStr)

def getIpAddress(req):
    if req.headers.get("X-Forwarded-For"):
        return req.headers.get("X-Forwarded-For").split(",")[0].strip()
    return req.remote_addr

def getRandomNumber(length):
    chars = "0123456789"
    return "".join(random.choice(chars) for _ in range(length))


def createOrderService(req, amount, orderInfo, returnUrl=None):
    vnp_Version = "2.1.0"
    vnp_Command = "pay"
    vnp_TxnRef = getRandomNumber(8)
    vnp_IpAddr = getIpAddress(req)
    orderType = "order-type"

    now = datetime.now()
    expire = now + timedelta(minutes=15)

    vnp_Params = {
        "vnp_Version": vnp_Version,
        "vnp_Command": vnp_Command,
        "vnp_TmnCode": vnp_TmnCode,
        "vnp_Amount": str(int(amount) * 100),
        "vnp_CurrCode": "VND",
        "vnp_TxnRef": vnp_TxnRef,
        "vnp_OrderInfo": orderInfo,
        "vnp_OrderType": orderType,
        "vnp_Locale": "vn",
        "vnp_ReturnUrl": vnp_Returnurl,
        "vnp_IpAddr": vnp_IpAddr,
        "vnp_CreateDate": now.strftime("%Y%m%d%H%M%S"),
        "vnp_ExpireDate": expire.strftime("%Y%m%d%H%M%S"),
    }

    sortedFields = sorted(vnp_Params.keys())
    queryString = "&".join(f"{key}={quote_plus(str(vnp_Params[key]))}" for key in sortedFields)
    secureHash = hmacSHA512(vnp_HashSecret, queryString)
    return f"{vnp_PayUrl}?{queryString}&vnp_SecureHash={secureHash}"


def orderReturnService(req):
    # Flask: req.args là tương đương req.query
    fields = {}
    for key in req.args:
        value = req.args.get(key)
        fields[key] = quote_plus(value)
    vnp_SecureHash = fields.get("vnp_SecureHash", None)
    fields.pop("vnp_SecureHash", None)
    fields.pop("vnp_SecureHashType", None)
    signValue = hashAllFields(fields)
    if signValue == vnp_SecureHash:
        if req.args.get("vnp_TransactionStatus") == "00":
            return 1
        return 0
    return -1
