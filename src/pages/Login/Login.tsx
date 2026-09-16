import styles from "./Login.module.css";

function Login() {
  return (
    <div className={styles.container}>
      {/* Left Panel */}
      <div className={styles.leftPanel}>
        <h1 className={styles.heading}>
          Smart Park QCU Parking Management System
        </h1>
        <p className={styles.subtext}>
          A parking application that registers vehicles, tracks real-time
          availability, and manages citations with ease.
        </p>
        <div className={styles.users}>
          <span>+100 users</span>
        </div>
      </div>

      {/* Right Panel */}
      <div className={styles.rightPanel}>
        <h2 className={styles.title}>Log In</h2>
        <p className={styles.subtitle}>
          Enter your credentials to manage your parking access.
        </p>

        {/* Form */}
        <form className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="fullname">Full name*</label>
            <input type="text" id="fullname" placeholder="John Doe" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="schoolId">School ID*</label>
            <input type="text" id="schoolId" placeholder="21-104" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address*</label>
            <input type="email" id="email" placeholder="johndoe@gmail.com" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password*</label>
            <input type="password" id="password" placeholder="********" />
          </div>

          <div className={styles.options}>
            <label>
              <input type="checkbox" /> Remember this device for 30 days
            </label>
            <a href="#">Forgot Password?</a>
          </div>

          <button type="submit" className={styles.signInBtn}>
            Sign In
          </button>
        </form>

        <p className={styles.footer}>
          New user? <a href="#">Register your vehicle</a>
        </p>
        <small className={styles.terms}>
          By logging in, you agree to SmartPark’s Terms & Conditions.
        </small>
      </div>
    </div>
  );
}

export default Login;
