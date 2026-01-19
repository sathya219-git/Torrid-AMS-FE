export const ENV={
    API_BASE_URL:process.env.REACT_APP_API_URL ||"",
    ENVIRONMENT:process.env.REACT_APP_ENV || "Development",
    IS_PROD:process.env.REACT_APP_ENV==="Production",
};