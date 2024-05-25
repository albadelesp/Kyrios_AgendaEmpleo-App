import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const questions = [
  '¿Cuál es tu mayor fortaleza? Ponme un ejemplo de cuando demostraste esa fortaleza',
  '¿Puedes describir un momento en el que superaste un desafío en el trabajo?',
  '¿Qué te gusta hacer en tu tiempo libre?',
  '¿Tienes alguna pregunta sobre el trabajo o la empresa?',
  '¿Te gusta más trabajar solo o con gente?',
  '¿Cuáles son tus mayores debilidades?',
  '¿Por qué estás interesado/a en este trabajo?',
  '¿Cómo te mantienes motivado/a en el trabajo?',
  '¿Qué te motiva a querer trabajar aquí?',
  '¿Qué habilidades crees que son importantes para este trabajo?'
];

const emoticons = [
  "happy-outline", 
  "help-outline", 
  "thumbs-up-outline", 
  "bulb-outline", 
  "earth-outline",
  "dice-outline",
  "ribbon-outline",
  "school-outline",
  "trophy-outline"
];

const getRandomEmoticon = () => {
  const randomIndex = Math.floor(Math.random() * emoticons.length);
  return emoticons[randomIndex];
};

const QuestionsScreen = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentEmoticon, setCurrentEmoticon] = useState(getRandomEmoticon());

  const handleNextPress = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentEmoticon(getRandomEmoticon());
    }
  };

  const handlePrevPress = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setCurrentEmoticon(getRandomEmoticon());
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Preguntas Frecuentes</Text>
      <Text style={styles.header2}>en</Text>
      <Text style={styles.header2}>Entrevistas de trabajo</Text>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{questions[currentQuestionIndex]}</Text>
      </View>
      <Ionicons name={currentEmoticon} size={50} color="#F2EDE5" style={styles.emoticon} />
      <View style={styles.navigationContainer}>
        <TouchableOpacity 
          onPress={handlePrevPress} 
          style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledButton]}
          disabled={currentQuestionIndex === 0}
        >
          <Text style={styles.navButtonText}>Anterior</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handleNextPress} 
          style={[styles.navButton, currentQuestionIndex === questions.length - 1 && styles.disabledButton]}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          <Text style={styles.navButtonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.counterText}>
        Pregunta {currentQuestionIndex + 1} de {questions.length}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCC046',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,

  },
  header2: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,

  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 30,
  },
  navButton: {
    backgroundColor: '#F1A801',
    padding: 10,
    borderRadius: 5,
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#E3AA28',
  },
  counterText: {
    fontSize: 16,
    marginTop: 20,
  },
  emoticon: {
    marginTop: 0
  },
});

export default QuestionsScreen;
