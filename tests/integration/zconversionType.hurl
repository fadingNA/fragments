# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# user1@email.com:password1
Content-Type: text/plain

[BasicAuth]
user1@email.com:password1

`Hello Image`

HTTP/1.1 201
Content-Type: text/plain; charset=utf-8

[Captures]
url: header "Location"
id: jsonpath "$.fragments.id"

# GET the created fragment
GET {{url}}
HTTP/1.1 401

# Retry GET with authentication
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/plain; charset=utf-8
Content-Length: 11

# Assertions for the retrieved fragment
[Asserts]
header "Content-Type" startsWith "text/"
body == "Hello Image"

# Update the fragment using PUT
PUT {{url}}

Content-Type: text/plain; charset=utf-8
[BasicAuth]
user1@email.com:password1

`Hello Image Update`

HTTP/1.1 200

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/plain; charset=utf-8
Content-Length: 18

[Asserts]
header "Content-Type" startsWith "text/"
body == "Hello Image Update"
