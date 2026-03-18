Añadir campo roles segun sufijo a usuario (Default=user, mod, admin)
Añadir tabla notificaciones donde activo no-leida, no-gestionada
Añadir campo nacionalidad y paises visitados a usuario
Añadir tabla paises (Nombre, Abreviacion=ID, nacionalidad, imagen)
Añadir tabla intermedia usuario-paises
```mermaid
erDiagram

	role_enum {
		varchar USER
		varchar MOD
		varchar ADMIN
	}
    USERS {
        int id PK
        varchar name
        varchar email UK
        datetime email_verified_at
        varchar password
		role_enum role
		varchar img
        boolean active
        varchar remember_token
        timestamp created_at
        timestamp updated_at
        text two_factor_secret
        text two_factor_recovery_codes
        timestamp two_factor_confirmed_at
    }
    USERS_COUNTRIES_VISITED{
	    int id PK
	    int user_id FK
	    int countries_id FK
    }
	COUNTRIES{
		varchar code PK
		varchar name
		varchar nationality
		varchar img
	}
    POST {
        int id PK
        int user_id FK
        varchar title
        timestamp experience_date
        varchar image
        varchar latitude
        varchar longitude
		varchar country_code FK
        boolean public
        boolean active
        timestamp created_at
        timestamp updated_at
    }
	POST_COUNTRIES{
	    int id PK
	    int post_id FK
	    int countries_id FK
    }
    POST_CATEGORIES {
        int id PK
        int post_id FK
        int category_id FK
    }

    CATEGORIES {
        int id PK
        varchar name
        varchar description
        timestamp created_at
        timestamp updated_at
    }

    RATING {
        int id PK
        int user_id FK
        int post_id FK
        tinyint rating
        timestamp created_at
        timestamp updated_at
    }
    %%UNIQUE(user_id, post_id)

    REPORTS {
        int id PK
        int post_id FK
        int user_id FK
        varchar reason
        boolean active
        timestamp created_at
        timestamp updated_at
    }
	
	NOTIFICATIONS{
		int id PK
		varchar message
		int sender FK
		int reciver FK
	}

    USERS ||--o{ POST : "creates"
    USERS ||--o{ RATING : "rates"
    USERS ||--o{ REPORTS : "reports"

    POST ||--o{ POST_CATEGORIES : "has"
    POST ||--o{ RATING : "receives"
    POST ||--o{ REPORTS : "receives"

    CATEGORIES ||--o{ POST_CATEGORIES : "has"
    role_enum }o--|| USERS : "role_enum_types"
    
    USERS }o--|| USERS_COUNTRIES_VISITED : "has"
    POST }o--|| POST_COUNTRIES : "has"
    
    USERS_COUNTRIES_VISITED }o--|| COUNTRIES : "contains"
    POST_COUNTRIES }o--|| COUNTRIES : "contains"
    USERS }o--|| NOTIFICATIONS : "sends"
    USERS }o--|| NOTIFICATIONS : "recived"
   
```
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
    