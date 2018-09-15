# Simple service to get size of directories using an API

To use this in production, implement a security layer.

## Command to run this service:

```bash
docker run -p 80:80 --restart unless-stopped \
    -v </dir>:</dir>:ro \
    <image-name>
```