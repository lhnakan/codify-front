/* eslint-disable no-alert */
import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import Header from "../../components/Header";
import UserContext from "../../contexts/UserContext";
import CoursesService from "../../services/CoursesService";
import SignIn from "../SignIn";
import CardsSection from "./components/CardsSection";
import SnippetSection from "./components/SnippetSection";
import WelcomeBanner from "./components/WelcomeBanner";
import { Container, MainContent } from "./styles";
import GoogleAnalyticsTracker from "../../hooks/GoogleAnalyticsTracker";

export default function Home() {
  const history = useHistory();
  const { user } = useContext(UserContext);
  const [coursesStarted, setCoursesStarted] = useState([]);
  const [snippetCourse, setSnippetCourse] = useState({});
  const [courses, setCourses] = useState([]);

  if (!user) {
    history.push("/");
    return <SignIn />;
  }

  const getAllCoursesStarted = async () => {
    const data = await CoursesService.getAllCoursesStarted(user.token);
    if (data) {
      const lastCourseSeen = data.splice(0, 1)[0];
      setSnippetCourse(lastCourseSeen);

      setCoursesStarted(data);
    } else {
      alert("Erro ao carregar cursos");
    }
  };

  const getAllCoursesNotStarted = async () => {
    const data = await CoursesService.getAllCoursesNotStarted(user.token);
    if (data) {
      setCourses(data);
    } else {
      alert("Erro ao carregar cursos");
    }
  };

  useEffect(async () => {
    getAllCoursesStarted();
    getAllCoursesNotStarted();
  }, []);

  return (
    <Container>
      <Header />
      <WelcomeBanner isSomeCourseStarted={coursesStarted.length === 0} />
      <MainContent>
        {snippetCourse && (
          <SnippetSection
            title="Continue seu curso atual"
            course={snippetCourse}
          />
        )}

        {coursesStarted.length === 0 ? (
          <>
            <CardsSection
              title="Experimente nossos outros cursos"
              courses={courses}
            />
          </>
        ) : (
          <>
            <CardsSection
              title="Meus cursos em andamento"
              courses={coursesStarted}
              coursesStarted
            />
            <CardsSection
              title="Experimente nossos outros cursos"
              courses={courses}
            />
          </>
        )}
      </MainContent>
      
      <GoogleAnalyticsTracker />
    </Container>
  );
}
