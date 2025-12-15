export interface Input {
    type: string;
    name: string;
    id: string;
    label: string;
    placeholder?: string;
    value?: string;
    error?: string;
    className?: string;
    events?: Record<string, (e: Event) => void>;
}
