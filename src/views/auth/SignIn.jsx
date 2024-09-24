import InputField from "components/fields/InputField";
import { Link, useNavigate } from "react-router-dom";
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import { yupResolver } from 'mantine-form-yup-resolver';
import * as yup from 'yup'
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../services/authservice";
import { useForm } from "@mantine/form";
import { Loader, LoadingOverlay } from "@mantine/core";

const schema = yup.object().shape({
  username: yup
    .string()
    .required('Invalid login')
    .email('Invalid email'),
    password: yup
    .string()
    .required('Invalid login')
    .min(6, 'invalid password'),
});

export default function SignIn() {
  const navigate = useNavigate();
  const sign = useSignIn();
  const isAuthenticated = useIsAuthenticated();
  useEffect(() => {
    if(isAuthenticated) {
      navigate('/admin', { replace: true })
    }
    }, [isAuthenticated,navigate]);

    const form = useForm({
      initialValues: {
        username: '',
        password: '',
      },
      validate: yupResolver(schema),
    });

    const { mutate, isPending } = useMutation({
      mutationFn:(data) => login(data),
      onSuccess(data) {
        if (
          sign({auth: {
            token:data?.token,
            type: 'Bearer'
        },
        userState:{ id: data?.id,prenom: data?.prenom, nom: data?.nom,fonction: data?.fonction}
      })
        ) {
          const targetDashboard = "/admin";
          navigate(targetDashboard, { replace: true });
        } else {
          // message.error("Connection Echouée !!!");
        }
      },
    });


    const onLogin = (values) => {
      mutate(values);
    }

  return (
    <div className="mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <LoadingOverlay
         visible={isPending}
         zIndex={1000}
         overlayProps={{ radius: 'sm', blur: 2 }}
         loaderProps={{ color: 'blue', type: 'dots' }}
       />
      {/* Sign in section */}
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
      <Link className="inline-block" to="/">
              <div className="flex items-center justify-center w-52 h-52 rounded-full bg-gray-200 shadow-6 shadow-blue-500 animate-pulse">
               <img src='/logo-bg.png' alt="Logo" className='w-40 h-40' />
             </div>
              </Link>
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Se Connecter
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Entrer votre email et votre mot de passe!
        </p>
        <form onSubmit={form.onSubmit(onLogin)}>
        {/* Email */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Email*"
          placeholder="mail@simmmple.com"
          id="email"
          type="text"
          {...form.getInputProps('username')}
        />

        {/* Password */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Mot de passe*"
          placeholder="Min. 8 characters"
          id="password"
          type="password"
          {...form.getInputProps('password')}
        />
        {/* Checkbox */}
       
        <button type="submit" className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
          <div className="flex items-center justify-center space-x-3">
            <span>Se Connecter</span>
            {isPending && <Loader size="md" color="white" type="dots" />}
          </div>
         
        </button>
       </form>
      </div>
    </div>
  );
}
