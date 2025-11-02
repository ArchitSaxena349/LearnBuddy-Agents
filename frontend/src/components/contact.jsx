import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().min(2, "Must be at least 2 characters").required("Required"),
  email: Yup.string().email("Invalid email address").required("Required"),
  subject: Yup.string().min(3, "Must be at least 3 characters").required("Required"),
  message: Yup.string().min(10, "Must be at least 10 characters").required("Required"),
});

const Contact = () => {
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    console.log("Contact Form Values:", values);
    setSubmitting(false);
    resetForm();
  };

  return (
    <div className="flex min-h-screen animate-fade-in">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center items-center bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Contact Us</h1>
          <p className="text-gray-600 mb-8">We'd love to hear from you! Fill out the form below.</p>

          <Formik
            initialValues={{ name: "", email: "", subject: "", message: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <Field
                    type="text"
                    name="name"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                  {errors.name && touched.name && (
                    <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                    placeholder="Enter your email"
                  />
                  {errors.email && touched.email && (
                    <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <Field
                    type="text"
                    name="subject"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                    placeholder="Enter the subject"
                  />
                  {errors.subject && touched.subject && (
                    <div className="text-red-500 text-sm mt-1">{errors.subject}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <Field
                    as="textarea"
                    name="message"
                    rows={5}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-all duration-300 resize-y"
                    placeholder="Enter your message"
                  />
                  {errors.message && touched.message && (
                    <div className="text-red-500 text-sm mt-1">{errors.message}</div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Prefer another way? Reach us at{" "}
              <a href="mailto:support@learnyfy.com" className="text-purple-600 hover:underline">
                support@learnyfy.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-purple-400 to-purple-600 p-12">
        <div
          className="h-full w-full bg-contain bg-center bg-no-repeat animate-pulse-slow"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1516321310764-959200eb3e35?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Contact;