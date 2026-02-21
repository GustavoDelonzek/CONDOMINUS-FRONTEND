# Estágio 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Produção (Leve e Seguro)
FROM nginx:stable-alpine
# Copia o build do estágio anterior para o diretório do Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Copia uma config customizada do Nginx para suportar React Router (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]