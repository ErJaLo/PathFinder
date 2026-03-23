export type ExperienceCategory = {
    id: number;
    name: string;
};

export type ExperienceCountry = {
    code: string;
    name: string;
    img?: string | null;
};

export type ExperienceAuthor = {
    id: number;
    name: string;
    img?: string | null;
};

export type Experience = {
    id: number;
    title: string;
    content: string;
    image?: string | null;
    experience_date: string;
    created_at: string;
    user: ExperienceAuthor;
    categories: ExperienceCategory[];
    main_country: ExperienceCountry | null;
    ratings_up_count: number;
    ratings_down_count: number;
};
