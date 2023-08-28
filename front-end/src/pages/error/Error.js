import MainNavigation from "../../components/navigation/MainNavigation";

const ErrorPage = () => {
  return (
    <>
      <MainNavigation></MainNavigation>
      <main className="container">
        <div className="text-center m-5">
          <h1>404 - Not Found</h1>
          <p>The page you're looking for doesn't exist.</p>
        </div>
      </main>
    </>
  );
};

export default ErrorPage;
