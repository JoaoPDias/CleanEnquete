export interface AddSurveyRequest {
    question : string
    answers : Array<{ image : string, answer : string }>
}