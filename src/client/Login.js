import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { makeApiCall } from "@/common/makeApiCall.js";
import { apiEndpoints } from "./apiEndpoints.js";
import { useAuthStore } from "./authStore.js";

const Login = ({ className = "" }) => {
	const navigate = useNavigate();
	const { setUsername } = useAuthStore();
	const [formData, setFormData] = useState({
		username: null,
		password: null,
	});

	const [errors, setErrors] = useState({});
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		if (success === true) {
			navigate(0);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [success]);

	const validateForm = () => {
		const newErrors = {};

		if (!formData.username.trim()) {
			newErrors.username = "Username is required";
		} else if (formData.username.length < 3) {
			newErrors.username = "Username must be at least 4 characters";
		}

		if (!formData.password.trim()) {
			newErrors.password = "Password is required";
		} else if (formData.username.length < 8) {
			newErrors.username = "Password must be at least 9 characters";
		}

		return newErrors;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const newErrors = validateForm();

		if (Object.keys(newErrors).length === 0) {
			try {
				const result = await makeApiCall(
					apiEndpoints.loginUser,
					{},
					formData
				);

				if (result.isAuthenticated) {
					setUsername(result.userInfo.username);
					setSuccess(true);
				}

				setFormData({
					username: null,
					password: null,
				});
			} catch (error) {
				setErrors(error);
				console.error("Error attempting login: ", error);
			}
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	return (
		<div className={`flex flex-1 justify-center items-center ${className}`}>
			{success && (
				<Alert className="mb-6 bg-green-50 text-green-750">
					<CheckCircle2 className="h4- w4" />
					<AlertDescription>Login Successful!</AlertDescription>
				</Alert>
			)}

			<form
				onSubmit={handleSubmit}
				className=" space-y-4 w-full justify-center items-center"
			>
				<div className="justify-center items-center">
					<Label htmlFor="username" className="text-center">
						Username
					</Label>
					<Input
						id="username"
						name="username"
						type="text"
						value={formData.username}
						onChange={handleChange}
						className={errors.username ? "border-red-500" : ""}
					/>
					{errors.username && (
						<div className="flex items-center mt-1 text-red-500 text-sm">
							<AlertCircle className="h-4 w-4 mr-1">
								{errors.username}
							</AlertCircle>
						</div>
					)}
				</div>

				<div>
					<Label htmlFor="password" className="text-center">
						Password
					</Label>
					<Input
						id="password"
						name="password"
						type="password"
						value={formData.password}
						onChange={handleChange}
						className={errors.password ? "border-red-500" : ""}
					/>
					{errors.password && (
						<div className="flex items-center mt-1 text-red-500 text-sm">
							<AlertCircle className="h-4 w-4 mr-1" />
							{errors.password}
						</div>
					)}
				</div>

				<Button
					type="submit"
					className="w-full h-10 rounded-md hover:bg-slate-250 gap-4"
				>
					Login
				</Button>
			</form>
		</div>
	);
};

export default Login;
