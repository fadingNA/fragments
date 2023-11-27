# tests/integration/post-fragments.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments

# user1@email.com:password1
Content-Type: text/plain; charset=utf-8

[BasicAuth]
user1@email.com:password1

`Hello S3!`

HTTP/1.1 201


[Captures] 
url: header "Location"

GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200

[Asserts]
header "Content-Type" matches "^text/plain;\\s*charset=utf-8$"
body == "Hello S3!"

DELETE {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
[Asserts]
status == 200

GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 404
[Asserts]
status == 404

