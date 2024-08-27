export interface Profile {
    profileNo: number;
    profileImg: string;
    profileName: string;
    profileMain: string; // 'M' for Main, 'S' for Sub
    profilePwd: number; // 비밀번호 필드 추가
    isLocked: boolean; // 잠금 여부 필드 추가
    tetrisHighScore: number;
}