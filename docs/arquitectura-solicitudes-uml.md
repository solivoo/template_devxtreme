# Arquitectura de solicitudes — UML

Abre este archivo en [Mermaid Live Editor](https://mermaid.live) y pega el bloque del diagrama. Estilo corporativo: monocromático, compacto, sin fondos en columnas; bordes solo en mensajes, notas y bloques `alt`/`opt`.

---

## Diagrama de secuencia (corporativo)

```mermaid
%%{init: {
  "theme": "base",
  "themeVariables": {
    "fontFamily": "Segoe UI, Inter, sans-serif",
    "fontSize": "12px",
    "background": "#ffffff",
    "primaryColor": "#ffffff",
    "primaryTextColor": "#1a1a1a",
    "primaryBorderColor": "#333333",
    "secondaryColor": "#ffffff",
    "secondaryTextColor": "#333333",
    "secondaryBorderColor": "#333333",
    "tertiaryColor": "#ffffff",
    "tertiaryTextColor": "#1a1a1a",
    "tertiaryBorderColor": "#333333",
    "lineColor": "#333333",
    "textColor": "#1a1a1a",
    "mainBkg": "#ffffff",
    "actorBorder": "#ffffff",
    "actorBkg": "#ffffff",
    "actorTextColor": "#1a1a1a",
    "signalColor": "#333333",
    "signalTextColor": "#1a1a1a",
    "labelBoxBkgColor": "#ffffff",
    "labelBoxBorderColor": "#333333",
    "labelTextColor": "#1a1a1a",
    "loopTextColor": "#1a1a1a",
    "noteBkgColor": "#ffffff",
    "noteBorderColor": "#333333",
    "noteTextColor": "#1a1a1a",
    "activationBorderColor": "#333333",
    "activationBkgColor": "#f5f5f5",
    "sequenceNumberColor": "#ffffff"
  },
  "themeCSS": "rect.rect{stroke:none!important;fill:transparent!important}rect.actor{stroke:none!important;fill:#fff!important}.actor-line{stroke:#ccc!important;stroke-width:1px!important}.note{stroke:#333!important;fill:#fff!important;stroke-width:1px!important}.labelBox{stroke:#333!important;fill:#fff!important;stroke-width:1px!important}.labelText,.loopText,.noteText,.messageText{fill:#1a1a1a!important}.messageLine0,.messageLine1{stroke:#333!important}",
  "sequence": {
    "diagramMarginX": 32,
    "diagramMarginY": 16,
    "actorMargin": 48,
    "width": 140,
    "height": 36,
    "boxMargin": 6,
    "boxTextMargin": 4,
    "noteMargin": 8,
    "messageMargin": 28,
    "mirrorActors": false,
    "useMaxWidth": true,
    "wrap": true,
    "wrapPadding": 6
  }
}}%%

sequenceDiagram
    autonumber

    box transparent Cliente
        participant E as Equipo
    end

    box transparent Perímetro CDN
        participant CF as Cloudflare
    end

    box transparent Frontend
        participant S as Sitio estático
    end

    box transparent Backend
        participant API as API
    end

    box transparent Seguridad
        participant SEC as Pipeline<br/>seguridad
    end

    box transparent Persistencia
        participant DB as Base de datos
    end

    Note over E,CF: Fase 1 — Entrada HTTPS
    E ->>+ CF: GET / POST HTTPS
    Note right of CF: Filtrado geo · Bots · DDoS
    CF ->>- S: Reenvío HTTPS

    Note over S,API: Fase 2 — Datos del equipo
    S ->>+ API: Llamada API (HTTPS)
    API ->>+ SEC: Validar solicitud
    Note right of SEC: Control de consumo<br/>Validación de datos<br/>Control de origen · Control de accesos
    SEC -->>- API: Autorizado / rechazado

    Note over API,DB: Fase 3 — Respuesta
    alt Solicitud válida
        API ->>+ DB: Query / comando
        DB -->>- API: Registros
        API -->>- S: JSON 200 OK
        S -->> E: Página · datos equipo
    else Rechazada
        API -->> S: 4xx / 429
        S -->> E: Error controlado
    end
```

---

## Diagrama de componentes (corporativo)

```mermaid
%%{init: {
  "theme": "base",
  "themeVariables": {
    "fontFamily": "Segoe UI, Inter, sans-serif",
    "fontSize": "12px",
    "background": "#ffffff",
    "primaryColor": "#ffffff",
    "primaryTextColor": "#1a1a1a",
    "primaryBorderColor": "#333333",
    "lineColor": "#333333",
    "secondaryColor": "#ffffff",
    "tertiaryColor": "#ffffff",
    "clusterBkg": "transparent",
    "clusterBorder": "transparent",
    "titleColor": "#1a1a1a"
  },
  "themeCSS": ".cluster rect{stroke:none!important;fill:transparent!important}.cluster .cluster-label{fill:#1a1a1a!important}.node rect,.node circle,.node polygon,.node path{stroke:#333!important;fill:#fff!important}",
  "flowchart": {
    "diagramPadding": 16,
    "nodeSpacing": 36,
    "rankSpacing": 44,
    "padding": 12,
    "useMaxWidth": true,
    "htmlLabels": true
  }
}}%%

flowchart TB
    subgraph Cliente[" Capa cliente "]
        direction LR
        Equipo["Equipo"]
        QR["QR → URL"]
        Equipo ~~~ QR
    end

    subgraph Perimetro[" Perímetro "]
        CF["Cloudflare<br/><small>Geo · Bots · DDoS</small>"]
    end

    subgraph Presentacion[" Presentación "]
        Sitio["Sitio estático<br/><small>Información del equipo</small>"]
    end

    subgraph Aplicacion[" Aplicación "]
        API["API REST"]
    end

    subgraph Seguridad[" Seguridad (API) "]
        direction TB
        S1["Control de consumo"] --> S2["Validación de datos"]
        S2 --> S3["Control de origen"]
        S3 --> S4["Control de accesos"]
    end

    subgraph Datos[" Datos "]
        DB[("Base de datos")]
    end

    Equipo -->|"① HTTPS"| CF
    CF -->|"② HTTPS"| Sitio
    Sitio -->|"③ HTTPS solicitud"| API
    API -->|"⑥ HTTPS respuesta"| Sitio
    Sitio --> Equipo

    API --> Seguridad
    API <-->|"④ ↔ ⑤"| DB
```
