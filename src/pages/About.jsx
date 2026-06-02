import React from 'react'
import { replace, useNavigate } from 'react-router-dom'

export default function About() {

  const navigate = useNavigate();

  const redirectOnClick = ()=> {
    navigate('/')
  }

  const useStatFun = () => {
    const id = 123;
    navigate(`/testing/${id}`,{
      state: {
        name: "Vinod",
        age: 30
      }
    });
  }

  const setTrueFun = ()=> {

      navigate(`/`,{replace:true});

  }


  const setDelayFun = () => {
    setTimeout(() => {
      navigate("/home");
    }, 1000);
  }

  return (
    <>
      <div>About</div>
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software including versions of Lorem Ipsum.</p>
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software including versions of Lorem Ipsum.</p>
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software including versions of Lorem Ipsum.</p>
      <button onClick={()=> navigate('/')}>From html redirect after Click on button</button><br/>
      <button onClick={redirectOnClick}>Redirect using fucntion after Click on button</button><br/>
      <button onClick={useStatFun}>Set State and redirect using fucntion after Click on button</button><br/>
      <button onClick={setTrueFun}>Set Replace true and redirect using fucntion after Click on button</button><br/>
      <button onClick={setDelayFun}>Go to on home page after 1 second delay after Click on button</button>
    </>

  )
}
