import { getApiUrl } from '@/config/api';

// Типы данных
export interface Customer {
    id: string
    firstName?: string
    lastName?: string
    phoneNumber: string
    segment: string
    notes?: string
    status: string
    lastContactAt?: string
    createdAt: string
    updatedAt: string
    deletedAt?: string
}

export interface CustomersResponse {
  data: Customer[];
  total: number;
  page: number;
  limit: number;
}

// API методы
export const customersApi = {
  // Получить список клиентов
  async findMany(params: {
    page?: number;
    limit?: number;
    status?: string;
    segment?: string;
  } = {}): Promise<CustomersResponse> {
    // Фильтруем undefined и пустые строки
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== '')
    );
    
    const response = await fetch(getApiUrl('customers/find-many'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filteredParams),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch customers: ${response.statusText}`);
    }

    return response.json();
  },

  // Получить клиента по ID
  async findOne(customerId: string): Promise<Customer> {
    const response = await fetch(getApiUrl('customers/find-one'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customerId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch customer: ${response.statusText}`);
    }

    return response.json();
  },

  // Создать клиента
  async create(data: {
    customerId?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber: string;
    segment: string;
    notes?: string;
    status: string;
    lastContactAt?: string;
  }): Promise<Customer> {
    const response = await fetch(getApiUrl('customers/create-one'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Ошибка при создании клиента: ${(await response.json()).message}`);
    }

    return response.json();
  },

  // Обновить клиента
  async update(customerId: string, data: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    segment?: string;
    notes?: string;
    status?: string;
    lastContactAt?: string;
  }): Promise<Customer> {
    // Фильтруем undefined значения, чтобы не отправлять их на сервер
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );

    const response = await fetch(getApiUrl('customers/update-one'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        ...filteredData,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update customer: ${response.statusText}`);
    }

    return response.json();
  },

  // Удалить клиента
  async delete(customerId: string): Promise<void> {
    const response = await fetch(getApiUrl('customers/delete-one'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customerId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete customer: ${response.statusText}`);
    }
  },

  // Импортировать клиентов из CSV
  async importCsv(
    file: File,
    options: {
      segment?: string;
      status?: string;
      notes?: string;
    } = {}
  ): Promise<{
    totalRows: number;
    importedCount: number;
    skippedCount: number;
    errors: string[];
    executionTimeMs: number;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (options.segment) {
      formData.append('segment', options.segment);
    }
    if (options.status) {
      formData.append('status', options.status);
    }
    if (options.notes) {
      formData.append('notes', options.notes);
    }

    const response = await fetch(getApiUrl('customers/import-csv'), {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to import CSV: ${errorText}`);
    }

    return response.json();
  },

  async countAll(): Promise<number> {
    const response = await fetch(getApiUrl('customers/count-all'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch customers: ${response.statusText}`);
    }

    return response.json();
  },
}; 