import {useRef, useState, useEffect} from 'react';
import {CheckIcon, XIcon} from '@heroicons/react/solid';
import axios from './api/axios';

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register';

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(user);
    console.log(result);
    console.log(user);
    setValidName(result);
  }, [user]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    console.log(result);
    console.log(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg('Invalid Entry');
      return;
    }
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({user, pwd}),
        {
          headers: {
            'Content-Type': 'application/json',
            withCredentials: true,
          },
        }
      );
      console.log(response.data);
      console.log(response.accessToken);
      console.log(JSON.stringify(response));
      setSuccess(true);
      // clear input field
    } catch (error) {
      if (!error?.response) {
        setErrMsg('No Server Response');
      } else if (error.response?.status === 409) {
        setErrMsg('Username Taken');
      } else {
        setErrMsg('Registration Failed');
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <a href="#">Sign In</a>
          </p>
        </section>
      ) : (
        <section className="w-96 bg-white px-4 py-6">
          <p ref={errRef} aria-live="assertive">
            {errMsg}
          </p>
          <h1 className="mb-5 text-center text-2xl font-semibold tracking-wide">
            Register
          </h1>
          <form onSubmit={handleSubmit}>
            {/* <label className="block">
              <span className="block text-sm font-medium text-slate-700">
                Username
              </span> */}
            {/* Using form state modifers, the classes can be identical for every input */}
            {/* <input
                type="text"
                disabled
                className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm
      invalid:border-pink-500 invalid:text-pink-600 focus:border-sky-500 focus:outline-none
      focus:ring-1 focus:ring-sky-500 focus:invalid:border-pink-500 focus:invalid:ring-pink-500
      disabled:border-slate-200 disabled:bg-slate-50
      disabled:text-slate-500 disabled:shadow-none
    "
              />
            </label> */}
            <div>
              <label htmlFor="username">Username:</label>
              <input
                className={`mt-1 w-full py-1 px-1 focus:ring ${
                  user
                    ? validName
                      ? 'focus:border-green-300 focus:ring-green-200'
                      : 'focus:border-red-300 focus:ring-red-200'
                    : 'focus:border-indigo-300 focus:ring-indigo-200'
                }`}
                type="text"
                id="username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                required
                aria-invalid={validName ? 'false' : 'true'}
                aria-describedby="uidnote"
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
              />
              {userFocus && (
                <p
                  id="uidnote"
                  className="bg-gray-100 p-2 text-sm text-gray-700"
                >
                  4 to 24 characters.
                  <br />
                  Must begin with a letter.
                  <br />
                  Letters, numbers, underscores, hyphens allowed.
                </p>
              )}
            </div>

            <div className="mt-4">
              <label htmlFor="password">Password:</label>
              <input
                className={`mt-1 w-full py-1 px-1 focus:ring ${
                  pwd
                    ? validPwd
                      ? 'focus:border-green-300 focus:ring-green-200'
                      : 'focus:border-red-300 focus:ring-red-200'
                    : 'focus:border-indigo-300 focus:ring-indigo-200'
                }`}
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                required
                aria-invalid={validName ? 'false' : 'true'}
                aria-describedby="pwdnote"
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
              />
              {pwdFocus && (
                <p
                  id="pwdnote"
                  className="bg-gray-100 p-2 text-sm text-gray-700"
                >
                  8 to 24 characters.
                  <br />
                  Must include uppercase and lowercase letters, a number and a
                  special character.
                  <br />
                  Allowed special characters:{' '}
                  <span aria-label="exclamation mark">!</span>
                  <span aria-label="at symbol">@</span>
                  <span aria-label="hashtag">#</span>
                  <span aria-label="dollar sign">$</span>
                  <span aria-label="percent">%</span>
                </p>
              )}
            </div>

            <div className="mt-4">
              <label htmlFor="confirm_pwd">Confirm Password:</label>
              <input
                className={`mt-1 w-full py-1 px-1 focus:ring ${
                  matchPwd
                    ? validMatch
                      ? 'focus:border-green-300 focus:ring-green-200'
                      : 'focus:border-red-300 focus:ring-red-200'
                    : 'focus:border-indigo-300 focus:ring-indigo-200'
                }`}
                type="password"
                id="confirm_pwd"
                onChange={(e) => setMatchPwd(e.target.value)}
                required
                aria-invalid={validName ? 'false' : 'true'}
                aria-describedby="confirmnote"
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
              />
              {matchFocus && (
                <p
                  id="confirmnote"
                  className="bg-gray-100 p-2 text-sm text-gray-700"
                >
                  Must match the first password input field.
                </p>
              )}
            </div>

            <button
              type="submit"
              className={`mt-5 w-full bg-indigo-600 px-4 py-2 text-white ${
                !validName || !validPwd || !validMatch
                  ? 'cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
              disabled={!validName || !validPwd || !validMatch}
            >
              Sign Up
            </button>
          </form>
          <p className="mt-4">
            Already registered?
            <span className="ml-2 underline">
              {/** put router link here */}
              <a href="#">Sign in</a>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Register;
