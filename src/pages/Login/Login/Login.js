import React, { useEffect, useRef} from 'react';
import { Button, Form } from 'react-bootstrap';
import { useAuthState, useSendPasswordResetEmail, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import auth from '../../../firebase.init';
import Loading from '../../Shared/Loading/Loading';
import SocialLogin from '../SocialLogin/SocialLogin';

const Login = () => {
    const emailRef = useRef('');
    const passwordRef = useRef('');
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";
    let errorElement;
    
    const [user] = useAuthState(auth);
    const [
        signInWithEmailAndPassword,
        loginUser,
        loading,
        error,
      ] = useSignInWithEmailAndPassword(auth);

      useEffect(() => {
        if(loginUser){
            console.log(loginUser)
          const url = 'https://young-basin-02785.herokuapp.com/login';
          fetch(url, {
                method: "POST",
                body: JSON.stringify({
                    email: loginUser.user.email
                }),
                headers: {
                    'content-type': 'application/json'
                },
            })
            .then(res => res.json())
            .then(data => {
                localStorage.setItem('accessToken', data.token)
                navigate(from, {replace: true});
            })
        }
    },[loginUser])
    
    

      const [sendPasswordResetEmail, sending] = useSendPasswordResetEmail(auth);

      if(loading || sending){
          return <Loading/>
      }

      if(error) {
          errorElement = <p className='text-danger'>Error: {error?.message}</p>
      }
      

      const handleSubmit = async (event) => {
          event.preventDefault();
          const email = emailRef.current.value;
          const password = passwordRef.current.value;

          await signInWithEmailAndPassword(email, password);
          event.target.reset();
      }

      const handleReset = async() => {
          const email = emailRef.current.value;
          if(email){
              await sendPasswordResetEmail(email);
              toast('Sent email');
          }
          else{
              toast('Please enter your email address');
          }
      }
    return (
        <div className='container w-50 mt-5'>
            <h2 className="text-success text-center mt-2">Please Login</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control ref={emailRef} type="email" placeholder="Enter email" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control ref={passwordRef} type="password" placeholder="Password" required/>
                </Form.Group>
                <Button variant="primary" type="submit" className='d-block mx-auto w-75'>
                    Login
                </Button>
            </Form>
            <p>{errorElement}</p>
            <p>New to Gym Equipment Warehouse?<Link to='/register' className='text-primary text-decoration-none'>Please Register</Link></p>
            <p>Forget Password?<span onClick={handleReset} className='text-primary'>Reset Password</span></p>
            <SocialLogin/>
        </div>
    );
};

export default Login;