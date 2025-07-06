import axios from "@/interceptors/axiosInstance";
import type {
	LoginOrCreateUserPayload,
	LoginOrCreateUserResponse,
} from "@/types/user";

export async function loginOrCreateUser(
	payload: LoginOrCreateUserPayload
): Promise<LoginOrCreateUserResponse> {
	const { data } = await axios.post<LoginOrCreateUserResponse>(
		"/login",
		payload
	);
	return data;
}
