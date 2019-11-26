import React from "react"
import Container from 'react-bootstrap/Container'
import { navigate  } from "gatsby"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Row from 'react-bootstrap/Row'

const Login = () => (
    <div>
      <Container>
        <Row>
            <h1>Login</h1>
        </Row>
        <Row>
            <Formik
                initialValues={{ email: '', password: '' }}
                validate={values => {
                let errors = {};
                if (!values.email) {
                    errors.email = 'Required';
                } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                    errors.email = 'Invalid email address';
                }
                return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                    navigate("/collections/collections/")
                    setSubmitting(false);
                }, 400);
                }}
            >
                {({ isSubmitting }) => (
                <Form>
                    <Row>
                    <Field type="email" name="email" />
                    <ErrorMessage name="email" component="div" />
                    </Row>
                    <Row>
                    <Field type="password" name="password" />
                    <ErrorMessage name="password" component="div" />
                    </Row>
                    <Row>
                    <button type="submit" disabled={isSubmitting}>
                    Submit
                    </button>
                    </Row>
                </Form>
                )}
            </Formik>
        </Row>
      
      </Container>
    </div>
  );
  
  export default Login;