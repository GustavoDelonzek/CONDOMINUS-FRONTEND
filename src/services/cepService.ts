const BASE_URL = 'https://brasilapi.com.br/api/cep/v2';

export interface CepResponse {
    cep: string;
    state: string;
    city: string;
    neighborhood: string;
    street: string;
    service: string;
    location?: {
        type: string;
        coordinates: {
            longitude: string;
            latitude: string;
        };
    };
}

export async function fetchCep(cep: string): Promise<CepResponse> {
    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) {
        throw new Error('CEP deve ter 8 dígitos.');
    }

    const response = await fetch(`${BASE_URL}/${cleanCep}`);

    if (!response.ok) {
        throw new Error('CEP não encontrado.');
    }

    return response.json();
}
