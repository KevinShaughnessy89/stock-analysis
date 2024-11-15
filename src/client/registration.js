import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { makeApiCall } from '@/common/makeApiCall.js';
import { apiEndpoints } from './apiEndpoints.js';
import { useNavigate } from 'react-router-dom';

const UserRegistration = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: ''
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 4 characters';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.username.length < 8) {
            newErrors.username = 'Password must be at least 9 characters';
        }

        if (!formData.email.trim()) {
            newErrors.username = 'E-mail is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Error: passwords do not match';
        }

        return newErrors;   
    }

    useEffect(() => {
        if (success === true) {
            navigate(0);        
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success])

    const handleSubmit = async (e) => {
        
        e.preventDefault();

        const newErrors = validateForm();

        if (Object.keys(newErrors).length === 0) {
            try {
                await makeApiCall(apiEndpoints.registerUser, formData);
                console.log("Form submitted");
                setSuccess(true);
                setFormData({
                    username: '',
                    password: '',
                    confirmPassword: '',
                    email: ''
                });
            }
            catch (error) {
                setErrors(error);
                console.error("Error submitting form: ", error);
            }
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    }

    return (
        <div className='flex flex-1 flex-row justify-center items-center w-full h-full '>
            {success && (
                <Alert className='mb-6 bg-green-50 text-green-750'>
                    <CheckCircle2 className='h4- w4' />
                    <AlertDescription>Registration Successful! Please check your email</AlertDescription>
                </Alert>
            )}
            <form onSubmit={handleSubmit} className=' w-full space-y-4'>
                {/* First group of inputs */}
                <div className="flex flex-col gap-4">  {/* Vertical container */}
                    <div className="flex flex-row gap-4">  {/* First horizontal group */}
                        <div>
                            <Label htmlFor="username" className="text-center">Username</Label>
                            <Input id="username" name="username" type="text" value={formData.username} onChange={handleChange} className={errors.username ? "border-red-500" : ''} />
                            {errors.username && (
                                <div className='flex items-center mt-1 text-red-500 text-sm'>
                                    <AlertCircle className='h-4 w-4 mr-1' />
                                    {errors.username}
                                </div>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="email" className="text-center">E-Mail</Label>
                            <Input id="email" name="email" type="text" value={formData.email} onChange={handleChange} className={errors.email ? "border-red-500" : ''} />
                            {errors.email && (
                                <div className='flex items-center mt-1 text-red-500 text-sm'>
                                    <AlertCircle className='h-4 w-4 mr-1' />
                                    {errors.email}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Second group of inputs */}
                    <div className="flex flex-row gap-4">  {/* Second horizontal group */}
                        <div>
                            <Label htmlFor="password" className="text-center">Password</Label>
                            <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} className={errors.password ? 'border-red-500' : ''} />
                            {errors.password && (
                                <div className="flex items-center mt-1 text-red-500 text-sm">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.password}
                                </div>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="confirmPassword" className="text-center">Confirm Password</Label>
                            <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className={errors.confirmPassword ? 'border-red-500' : ''} />
                            {errors.confirmPassword && (
                                <div className="flex items-center mt-1 text-red-500 text-sm">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.confirmPassword}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <Button type="submit" className='w-full h-10 rounded-md hover:bg-slate-250 gap-4'>Register</Button>
            </form>
        </div>
    );
};

export default UserRegistration;