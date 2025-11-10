import backgroundApi from "./backgroundApi";
import marketAnalysisApi from "./marketAnalysisApi";
import marketingStrategiesApi from "./marketingStrategiesApi";
import productServiceApi from "./productServiceApi";
import operationalPlanApi from './operationalPlanApi';


// Export individual APIs
export { default as backgroundApi } from "./backgroundApi";
export { default as marketAnalysisApi } from "./marketAnalysisApi";
export { default as productServiceApi } from "./productServiceApi";
export { default as marketingStrategiesApi } from "./marketingStrategiesApi";
export { default as operationalPlanApi } from './operationalPlanApi';


// Export as grouped object (backward compatibility)
export const businessPlanAPI = {
  business: backgroundApi,
  marketAnalysis: marketAnalysisApi,
  productService: productServiceApi,
  marketingStrategies: marketingStrategiesApi,
  operationalPlan: operationalPlanApi,
};

export default businessPlanAPI;
