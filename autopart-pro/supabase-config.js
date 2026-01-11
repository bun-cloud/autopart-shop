/**
 * Supabase Configuration - Direct API Approach
 * Using direct fetch calls instead of Supabase client library
 * 
 * Environment Variables (set in Netlify Dashboard):
 * - SUPABASE_URL: Your Supabase project URL
 * - SUPABASE_ANON_KEY: Your Supabase anon key
 */

// Get credentials from environment variables (Netlify injects these)
// Falls back to defaults for local development
const SUPABASE_URL = 'https://opksqnxqabcmbyqwsgol.supabase.co';
const SUPABASE_KEY = 'sb_publishable_QVYyQczf2BkZwjqfn0Bvtw_ks2Qq4jT';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wa3NxbnhxYWJjbWJ5cXdzZ29sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MjMyNTIsImV4cCI6MjA4MzM5OTI1Mn0.gM6VOjT00HwoC4xPHNjufKqGfp92ObNadXHkxuZmz2s';

// Create a Supabase-like API wrapper
window.supabase = {
    // Products table operations
    from: function(tableName) {
        const ctx = {
            _columns: '*',
            _eq: null,
            _order: null,
            _limit: null
        };

        const executeDelete = async () => {
            let url = SUPABASE_URL + '/rest/v1/' + tableName;
            const params = new URLSearchParams();

            // For delete with .eq() filter
            if (ctx._eq) {
                params.append(ctx._eq.column, 'eq.' + ctx._eq.value);
            }

            // Build URL with query parameters
            const queryString = params.toString();
            if (queryString) {
                url += '?' + queryString;
            }

            try {
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'apikey': ANON_KEY,
                        'Authorization': 'Bearer ' + ANON_KEY,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok || response.status === 204) {
                    return { data: null, error: null };
                }

                const text = await response.text();
                const errorData = text ? JSON.parse(text) : {};
                return { data: null, error: { message: errorData.message || response.statusText } };
            } catch (err) {
                return { data: null, error: { message: err.message } };
            }
        };

        return {
            select: function(columns = '*') {
                ctx._columns = columns;
                return this._execute('select');
            },
            eq: function(column, value) {
                ctx._eq = { column, value };
                return this;
            },
            order: function(column, options = {}) {
                ctx._order = { column, ...options };
                return this;
            },
            limit: function(count) {
                ctx._limit = count;
                return this;
            },
            insert: function(data) {
                return this._execute('insert', data);
            },
            update: function(data) {
                const updateData = data;
                const builder = {
                    eq: (column, value) => {
                        ctx._eq = { column, value };
                        return this._execute('update', updateData);
                    }
                };
                builder.execute = () => this._execute('update', updateData);
                return builder;
            },
            delete: function() {
                const builder = {
                    eq: (column, value) => {
                        ctx._eq = { column, value };
                        return executeDelete();
                    }
                };
                builder.execute = () => executeDelete();
                return builder;
            },
            _execute: async function(method, data = null) {
                let url = SUPABASE_URL + '/rest/v1/' + tableName;
                const params = new URLSearchParams();

                // For SELECT queries
                if (method === 'select' || method === undefined) {
                    // Append select parameter
                    if (ctx._columns) {
                        params.append('select', ctx._columns);
                    }

                    // Add ordering if specified
                    if (ctx._order) {
                        params.append('order', ctx._order.column + '.' + (ctx._order.ascending ? 'asc' : 'desc'));
                    }

                    // Add limit if specified
                    if (ctx._limit) {
                        params.append('limit', ctx._limit.toString());
                    }

                    // Build URL with query parameters
                    const queryString = params.toString();
                    if (queryString) {
                        url += '?' + queryString;
                    }

                    // Execute GET request
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'apikey': ANON_KEY,
                            'Authorization': 'Bearer ' + ANON_KEY,
                            'Content-Type': 'application/json'
                        }
                    });

                    const text = await response.text();
                    const responseData = text ? JSON.parse(text) : [];

                    if (!response.ok) {
                        return { data: null, error: { message: response.statusText } };
                    }

                    return { data: responseData, error: null };
                }

                // For update with .eq() filter
                if (method === 'update' && ctx._eq) {
                    params.append(ctx._eq.column, 'eq.' + ctx._eq.value);
                }

                // Build URL with query parameters
                const queryString = params.toString();
                if (queryString) {
                    url += '?' + queryString;
                }

                // Set HTTP method
                let httpMethod = 'POST';
                if (method === 'update') httpMethod = 'PATCH';

                const options = {
                    method: httpMethod,
                    headers: {
                        'apikey': ANON_KEY,
                        'Authorization': 'Bearer ' + ANON_KEY,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    }
                };

                if (data) options.body = JSON.stringify(data);

                try {
                    const response = await fetch(url, options);

                    const text = await response.text();
                    const responseData = text ? JSON.parse(text) : [];

                    if (!response.ok) {
                        return { data: null, error: { message: response.statusText } };
                    }

                    // Return in the same format as official Supabase client
                    return { data: responseData, error: null };
                } catch (err) {
                    return { data: null, error: { message: err.message } };
                }
            }
        };
    },

    // Authentication operations
    auth: {
        signInWithPassword: async function(credentials) {
            try {
                const response = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SUPABASE_KEY
                    },
                    body: JSON.stringify(credentials)
                });

                const data = await response.json();

                if (response.ok) {
                    // Store session
                    localStorage.setItem('supabase_session', JSON.stringify(data));
                    return { data, error: null };
                } else {
                    return { data: null, error: { message: data.msg || data.error_description || 'Login failed' } };
                }
            } catch (err) {
                return { data: null, error: { message: err.message } };
            }
        },

        signOut: async function() {
            localStorage.removeItem('supabase_session');
            return { error: null };
        },

        getSession: async function() {
            try {
                const stored = localStorage.getItem('supabase_session');
                if (stored) {
                    const session = JSON.parse(stored);
                    return { data: { session }, error: null };
                }
                return { data: { session: null }, error: null };
            } catch (err) {
                return { data: { session: null }, error: null };
            }
        },

        onAuthStateChange: function(callback) {
            // Simple implementation - just call immediately if we have a session
            this.getSession().then(({ data }) => {
                if (data.session) {
                    callback('SIGNED_IN', data.session);
                } else {
                    callback('SIGNED_OUT', null);
                }
            });
        }
    }
};

window.supabaseReady = true;
console.log('Supabase API wrapper initialized');
