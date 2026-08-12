FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY Src/amazonmini.csproj Src/
RUN dotnet restore Src/amazonmini.csproj

COPY Src/ Src/
RUN dotnet publish Src/amazonmini.csproj \
    --configuration Release \
    --output /app/publish \
    --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "amazonmini.dll"]
