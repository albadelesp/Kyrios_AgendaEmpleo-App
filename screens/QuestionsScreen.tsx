import React, { useState } from 'react';
import { View, Text, StyleSheet, Button,ScrollView  } from 'react-native';

const questionsData = [
  {
    question: '¿Cuál es tu mayor fortaleza?',
    answer: 'Mi mayor fortaleza es mi capacidad para resolver problemas de manera creativa y encontrar soluciones innovadoras.',

  },
  {
    question: '¿Qué habilidades crees que son importantes para este trabajo?',
    answer: 'Creo que es importante ser organizado y puntual. También es útil tener habilidades básicas de comunicación y ser capaz de seguir instrucciones. Estoy dispuesto a aprender y mejorar en las áreas que sean necesarias para el trabajo.',

  },
  {
    question: '¿Qué te motiva a querer trabajar aquí?',
    answer: 'Me motiva la oportunidad de aprender y crecer en un entorno de trabajo positivo. Quiero contribuir con mis habilidades y esforzarme para hacer un buen trabajo.',

  },
  {
    question: '¿Cómo te mantienes motivado/a en el trabajo?',
    answer: ' Me mantengo motivado/a recordando mis metas y celebrando mis logros, por pequeños que sean. También me gusta aprender cosas nuevas y superar desafíos. Trabajo mejor cuando estoy rodeado/a de personas positivas y de apoyo.',
 
  },
  {
    question: '¿Por qué estás interesado/a en este trabajo?',
    answer: 'Estoy interesado/a en este trabajo porque me apasiona [profesión], y creo que mis habilidades y experiencia pueden contribuir positivamente al equipo.',
 
  },
  {
    question: '¿Cuáles son tus mayores debilidades?',
    answer: 'Una de mis mayores debilidades es que tiendo a ser demasiado autocrítico/a. Sin embargo, estoy trabajando en mejorar mi confianza en mí mismo/a y en aprender a valorar mis logros.',

  },
  {
    question: '¿Cuál es tu estilo de trabajo preferido?',
    answer: 'Mi estilo de trabajo preferido es colaborativo, donde puedo trabajar en equipo y compartir ideas con mis compañeros para alcanzar nuestros objetivos comunes.',
  },
  {
    question: '¿Tienes alguna pregunta sobre el trabajo o la empresa?',
    answer: 'Sí, ¿cuáles son las oportunidades de crecimiento profesional en esta empresa?. ¿Cómo es el ambiente de trabajo y la relación entre los empleados?',
  },
  {
    question: '¿Qué te gusta hacer en tu tiempo libre?',
    answer: 'Disfruto pasar tiempo con mi familia y amigos, salir a pasear y hacer actividades al aire libre. // Me gusta hacer manualidades y proyectos creativos en mi tiempo libre.' + 
    '// Disfruto de actividades como la música, la lectura o ver películas y series en casa.',
  },
  {
    question: '¿Puedes describir un momento en el que superaste un desafío en el trabajo?',
    answer: 'Hubo una situación en la que no sabía cómo resolver un problema, pero pedí ayuda y juntos encontramos una solución',
  },
  
];

const QuestionScreen = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
    const handleNextQuestion = () => {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    };
  
    const handlePreviousQuestion = () => {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    };
  
    const currentQuestion = questionsData[currentQuestionIndex];
  
    return (
        <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Preguntas Frecuentes en Entrevistas de Trabajo</Text>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>
        <View style={styles.answerContainer}>
          <Text style={styles.answerText}>{currentQuestion.answer}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Anterior" onPress={handlePreviousQuestion} disabled={currentQuestionIndex === 0} color={'black'} />
          <Button title="Siguiente" onPress={handleNextQuestion} disabled={currentQuestionIndex === questionsData.length - 1 } color={'black'} />
        </View>
        <Text style={styles.numberquestion}>
          Pregunta {currentQuestionIndex + 1} de {questionsData.length}
        </Text>
        <Text style={styles.note}>
          *Recuerda adaptar las preguntas y respuestas según el contexto específico del trabajo y las habilidades requeridas.
        </Text>
      </ScrollView>
    );
  };
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start', 
        alignItems: 'center', 
        backgroundColor: 'orange',
        paddingTop: 50, 
        paddingHorizontal: 20 
      },
    questionContainer: {
      marginBottom: 20,
      marginLeft: 4,
      marginTop: 40, 
    },
    questionText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
    },
    answerContainer: {
      marginBottom: 20
    },
    answerText: {
      fontSize: 16,
      marginTop: 10,
      color: 'black', 
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: 20
    },
    headerTitle: {
      fontSize: 25,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    numberquestion: {
      fontSize: 15,
      fontWeight: 'bold',
      color: 'black',
      marginTop: 20,
    },
    note:{
        fontSize: 13,
        fontWeight: 'bold',
        color: 'grey',
        marginTop: 40,   
    }
});

export default QuestionScreen;
