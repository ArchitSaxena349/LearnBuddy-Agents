import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (values, { setSubmitting }) => {
    console.log(values);
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center items-center">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2">{isLogin ? 'Log In' : 'Sign Up'}</h1>
          <p className="text-gray-600 mb-8">Welcome back! Please enter your details</p>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your email"
                  />
                  {errors.email && touched.email && (
                    <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <Field
                    type="password"
                    name="password"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your password"
                  />
                  {errors.password && touched.password && (
                    <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                  )}
                </div>

                {isLogin && (
                  <div className="flex justify-end">
                    <button type="button" className="text-purple-600 text-sm hover:underline">
                      forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  {isLogin ? 'Log in' : 'Sign up'}
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or Continue With</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-50">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo" className="h-5 w-5 mr-2" />
                <span>Google</span>
              </button>
              <button className="flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-50">
                <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook logo" className="h-5 w-5 mr-2" />
                <span>Facebook</span>
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-purple-600 hover:underline"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-purple-400 to-purple-600 p-12">
        <div className="h-full w-full bg-contain bg-center bg-no-repeat"
             style={{backgroundImage: "url('/src/assets/fitness-woman.jpg')"}}></div>
      </div>
    </div>
  );
};

export default Auth;