export default interface Attendance {
    created_at: Date;
    type: "in" | "out";
    user: string;
}