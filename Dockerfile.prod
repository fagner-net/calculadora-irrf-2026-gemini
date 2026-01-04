# Estágio 1: Build
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Estágio 2: Servidor de Produção (Nginx)
FROM nginx:alpine

# Copiar a configuração do Nginx customizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar os arquivos estáticos gerados no build
COPY --from=build /app/dist /usr/share/nginx/html

# O Cloud Run injeta a variável PORT, mas o Nginx aqui está configurado fixo na 8080 (padrão do Google)
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
