import hashlib

def hash(*args):
    text = ""

    for arg in args:
        text = text + arg

    h = hashlib.new('sha256')
    h.update(text.encode())

    return h.hexdigest()