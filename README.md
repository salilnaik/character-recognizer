# Character Recognizer
Just draw any number or letter and the machine learning model will predict what you drew.
Try it out at [https://salilnaik.github.io/character-recognizer](https://salilnaik.github.io/character-recognizer/)

### How it was made
This machine learning model at the heart of this project was a self-trained convolutional neural network using Tensorflow. It implemented 4 convolutional and flatten layers and then 1 fully connected layer. The model was trained on the Emnist By-Class dataset to allow the model to differentiate between lowercase and uppercase letters. This trained Tensorflow model was then converted into the TensorflowJS format to be able to run in the browser. This means that all computations are being run natively on the client device. Due to this heavy task required of the browser, the rest of the website was kept relatively simple to allow for better performance. However, more features and a better design are planned for the future.
