# 🌀 Dynamic Load Balancing with NGINX, Consul, and Docker Swarm

This project demonstrates a **dynamic, scalable load-balancing solution** for Express-based backend services using **NGINX**, **Consul**, **Consul-Template**, and **Docker Swarm**. It features **automatic service registration**, **real-time NGINX configuration updates**, and **high availability** through container orchestration.

---

## 📌 Features

- 🔄 **Automatic service discovery** with Consul
- ⚖️ **Load balancing** using NGINX reverse proxy
- 🧠 **Dynamic NGINX config updates** via Consul-Template
- 🐳 **Container orchestration** with Docker Swarm
- 🔐 **TLS encryption** with self-signed certificates
- 🔬 **Tested** using Apache JMeter under simulated load

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Ahsan-4894/Network-Load-Balancer.git
cd Network-Load-Balancer
```
### 2. Generate Self-Signed TLS Certificates
```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx.key -out nginx.cert
```

### 3. Move the generated certs into a certs/ directory
```bash
mkdir certs
mv nginx.key nginx.cert certs/
```

### 4. Deploy the Docker Stack
```bash
docker stack deploy -c ./docker-compose.yml loadbalancer
```

### 5. Deploy the NGINX Service
```bash
docker service create \
  --name nginx-service \
  -p 80:80 \
  -p 443:443 \
  --network loadbalancer_lb-net \
  --mount type=bind,src=$(pwd)/output/nginx.conf,dst=/etc/nginx/nginx.conf \
  --mount type=bind,src=$(pwd)/certs,dst=/etc/nginx/certs \
  nginx:latest
```

