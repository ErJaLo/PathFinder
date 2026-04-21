# Pathfinder — Diagrama de Base de Dades

## Notes de disseny
- **Rols d'usuari:** `user` (defecte), `moderator`, `admin` — camp enum a la taula `users`
- **Estats d'experiència:** `draft` (esborrany), `published` (publicada), `rejected` (rebutjada)
- **Estats de report:** `pending`, `reviewed`, `dismissed`
- **Coordenades:** `decimal(10,7)` per compatibilitat amb Leaflet/Google Maps
- **Països:** PK = `varchar code` (ISO 3166-1 alpha-2, ex: "ES", "FR")

## Diagrama principal (negoci)

```mermaid
erDiagram

    USERS {
        int id PK
        varchar name
        varchar email UK
        datetime email_verified_at
        varchar password
        enum role "user | moderator | admin"
        varchar img
        boolean active
        varchar remember_token
        timestamp created_at
        timestamp updated_at
        text two_factor_secret
        text two_factor_recovery_codes
        timestamp two_factor_confirmed_at
    }

    COUNTRIES {
        varchar code PK "ISO 3166-1 alpha-2"
        varchar name
        varchar nationality
        varchar img
    }

    USER_COUNTRY {
        int id PK
        int user_id FK
        varchar country_code FK
    }

    POSTS {
        int id PK
        int user_id FK
        varchar title
        text content "cos de experiencia"
        date experience_date
        varchar image
        decimal latitude "10,7"
        decimal longitude "10,7"
        varchar country_code FK
        enum status "draft | published | rejected"
        timestamp created_at
        timestamp updated_at
    }

    POST_COUNTRY {
        int id PK
        int post_id FK
        varchar country_code FK
    }

    CATEGORIES {
        int id PK
        varchar name UK
        varchar description
        timestamp created_at
        timestamp updated_at
    }

    POST_CATEGORY {
        int id PK
        int post_id FK
        int category_id FK
    }

    RATINGS {
        int id PK
        int user_id FK
        int post_id FK
        tinyint value "+1 o -1"
        timestamp created_at
        timestamp updated_at
    }
    %%UNIQUE(user_id, post_id)

    REPORTS {
        int id PK
        int user_id FK
        int post_id FK
        varchar reason
        enum status "pending | reviewed | dismissed"
        timestamp created_at
        timestamp updated_at
    }
    %%UNIQUE(user_id, post_id)

    NOTIFICATIONS {
        int id PK
        int sender_id FK
        int receiver_id FK
        varchar message
        boolean read
        timestamp created_at
        timestamp updated_at
    }

    USERS ||--o{ POSTS : "creates"
    USERS ||--o{ RATINGS : "rates"
    USERS ||--o{ REPORTS : "reports"
    USERS ||--o{ USER_COUNTRY : "has visited"
    USERS ||--o{ NOTIFICATIONS : "sends"
    USERS ||--o{ NOTIFICATIONS : "receives"

    POSTS ||--o{ POST_CATEGORY : "belongs to"
    POSTS ||--o{ POST_COUNTRY : "located in"
    POSTS ||--o{ RATINGS : "receives"
    POSTS ||--o{ REPORTS : "receives"

    CATEGORIES ||--o{ POST_CATEGORY : "has"

    COUNTRIES ||--o{ USER_COUNTRY : "visited by"
    COUNTRIES ||--o{ POST_COUNTRY : "contains"
    COUNTRIES ||--o{ POSTS : "main country"
```

## Diagrama de suport (Laravel infra)

```mermaid
erDiagram
    PASSWORD_RESET_TOKENS {
        varchar email PK
        varchar token
        timestamp created_at
    }

    SESSIONS {
        varchar id PK
        int user_id FK
        varchar ip_address
        text user_agent
        text payload
        int last_activity
    }

    CACHE {
        varchar key PK
        text value
        int expiration
    }

    CACHE_LOCKS {
        varchar key PK
        varchar owner
        int expiration
    }

    JOBS {
        int id PK
        varchar batch_id FK
        varchar queue
        text payload
        tinyint attempts
        int reserved_at
        int available_at
        int created_at
    }

    JOB_BATCHES {
        varchar id PK
        varchar name
        int total_jobs
        int pending_jobs
        int failed_jobs
        text failed_job_ids
        text options
        int cancelled_at
        int created_at
        int finished_at
    }

    FAILED_JOBS {
        int id PK
        varchar uuid UK
        text connection
        text queue
        text payload
        text exception
        timestamp failed_at
    }

    USERS ||--o{ SESSIONS : "has"
    USERS ||--o{ PASSWORD_RESET_TOKENS : "has"
    JOB_BATCHES ||--o{ JOBS : "contains"
```
