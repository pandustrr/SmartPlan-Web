import api from '../authApi';

export const marketAnalysisApi = {
    getAll: (params = {}) => {
        console.log('📡 Fetching market analyses with params:', params);
        return api.get("/market-analysis", { params })
            .then(response => {
                console.log('✅ Market analyses API response:', response.data);
                return response;
            })
            .catch(error => {
                console.error('❌ Market analyses API error:', error);
                throw error;
            });
    },
    
    getById: (id) => {
        console.log('📡 Fetching market analysis by ID:', id);
        return api.get(`/market-analysis/${id}`);
    },
    
    create: (analysisData) => {
        console.log('📡 Creating market analysis:', analysisData);
        return api.post("/market-analysis", analysisData);
    },
    
    update: (id, analysisData) => {
        console.log('📡 Updating market analysis:', id, analysisData);
        return api.put(`/market-analysis/${id}`, analysisData);
    },
    
    delete: (id, userId) => {
        console.log('📡 Deleting market analysis:', id);
        return api.delete(`/market-analysis/${id}`, { 
            data: { user_id: userId } 
        });
    },
};

export default marketAnalysisApi;