#!/bin/bash
set -e

CERTS_DIR="./certs"
mkdir -p "$CERTS_DIR"

# Elasticsearch: generate key and cert (PEM format)
ES_KEY="$CERTS_DIR/elasticsearch.key"
ES_CERT="$CERTS_DIR/elasticsearch.crt"
if [ ! -f "$ES_KEY" ] || [ ! -f "$ES_CERT" ]; then
  echo "Generating Elasticsearch PEM key and certificate..."
  openssl req -x509 -nodes -days 999 -newkey rsa:4096 \
    -keyout "$ES_KEY" -out "$ES_CERT" \
    -subj "//CN=elasticsearch" \
    -addext "subjectAltName=DNS:elasticsearch"
  chmod 600 "$ES_KEY"
  chmod 644 "$ES_CERT"
else
  echo "Elasticsearch key and certificate already exist."
fi

# Spring Boot: generate PKCS12 keystore
SPRING_KEYSTORE="$CERTS_DIR/springboot-keystore.p12"
KEYSTORE_PASS="changeit"
if [ ! -f "$SPRING_KEYSTORE" ]; then
  echo "Generating Spring Boot PKCS12 keystore..."
  keytool -genkeypair -alias springboot -keyalg RSA -keysize 2048 -validity 999 \
    -storetype PKCS12 -keystore "$SPRING_KEYSTORE" -storepass "$KEYSTORE_PASS" -keypass "$KEYSTORE_PASS" \
    -dname "CN=localhost, OU=Dev, O=MyCompany, L=City, ST=State, C=US"
  chmod 600 "$SPRING_KEYSTORE"
else
  echo "Spring Boot keystore already exists."
fi

# Create Java Truststore for Elasticsearch cert (used by Spring Boot to trust ES)
TRUSTSTORE="$CERTS_DIR/elasticsearch-truststore.p12"
TRUSTSTORE_PASS="changeit"
if [ ! -f "$TRUSTSTORE" ]; then
  echo "Generating Elasticsearch truststore for Spring Boot..."
  keytool -importcert -alias elasticsearchCA -file "$ES_CERT" -keystore "$TRUSTSTORE" -storetype PKCS12 -storepass "$TRUSTSTORE_PASS" -noprompt
  chmod 600 "$TRUSTSTORE"
else
  echo "Elasticsearch truststore already exists."
fi

echo "Certificate generation complete."
