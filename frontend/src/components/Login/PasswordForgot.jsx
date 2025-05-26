import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignupSchema = Yup.object().shape({
  email: Yup.string().email("Email invalide").required("Requis"),
});

const InputField = ({ label, name, type = "text", placeholder }) => (
  <div className="flex flex-col mb-4 relative">
    <label
      htmlFor={name}
      className="mb-1 text-sm font-medium text-gray-900 dark:text-white"
    >
      {label} <span className="text-red-700">*</span>
    </label>
    <Field
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      required
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-500 text-sm mt-1"
    />
  </div>
);

const PasswordForgot = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center px-6 py-8">
      <div className="w-full bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700 max-w-2xl">
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Mot de passe oublié ?
          </h1>
          <p>
            Entrez votre adresse e-mail ci-dessous afin de recevoir un lien
            pour ré-initialiser votre mot de passe.
          </p>

          <Formik
            initialValues={{ email: "" }}
            validationSchema={SignupSchema}
            onSubmit={async (values, { setSubmitting, setStatus }) => {
              try {
                const response = await axios.post("http://localhost:5000/forgot-password", {
                  email: values.email,
                });

                setStatus({
                  success: "Un email de réinitialisation vous a été envoyé.",
                });

                setTimeout(() => {
                  navigate("/");
                }, 2000);
              } catch (error) {
                setStatus({
                  error:
                    error.response?.data?.message ||
                    "Erreur lors de l’envoi de l’e-mail.",
                });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, status }) => (
              <Form className="space-y-4 mb-10">
                <div className="grid-cols-1 md:grid-cols-2 gap-4 mb-7">
                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                  />
                </div>

                {/* ✅ Messages de retour */}
                {status?.success && (
                  <div className="text-green-500 text-center">
                    {status.success}
                  </div>
                )}
                {status?.error && (
                  <div className="text-red-500 text-center">
                    {status.error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="max-md:w-full md:w-1/2 flex justify-center m-auto text-white Primary-Color hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700"
                >
                  {isSubmitting ? "En cours..." : "Envoyer"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="border-b-4 text-gray-300 mr-auto ml-auto flex w-1/4 mb-10"></div>
          <div className="flex justify-center mb-3">
            <p>
              Revenir à la page de{" "}
              <Link
                className="text-color"
                to="/connexion"
                onClick={() =>
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }
              >
                connexion
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PasswordForgot;
