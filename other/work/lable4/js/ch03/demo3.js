

         function computeMatrix(viewProjectionMatrix, translation, xRotation, yRotation) {
            var matrix = m4.translate(viewProjectionMatrix,
                translation[0],
                translation[1],
                translation[2]);
            matrix = m4.xRotate(matrix, xRotation);
            return m4.yRotate(matrix, yRotation);
        }
 
        const gl = document.querySelector("#c").getContext("webgl");
        const programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);
     
        const bufferInfo = twgl.createBufferInfoFromArrays(gl, createFivePointerStar(20));
        

        function render(time) {
            time *= 0.0005;
            twgl.resizeCanvasToDisplaySize(gl.canvas);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);


            var projectionMatrix  = m4.perspective(Math.PI/3,gl.canvas.clientWidth / gl.canvas.clientHeight,1,2000)
            var cameraPosition = [0, 0, 100];
            var target = [0, 0, 0];
            var target = [0, 0, 0];
            var up = [0, 1, 0];
            var cameraMatrix = m4.lookAt(cameraPosition, target, up);
            var viewMatrix = m4.inverse(cameraMatrix);
            var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
            var cubeTranslation   = [0, 0, 0];
            var cubeXRotation   = -time;
            var cubeYRotation   =  -time;
            const uniforms = {
                u_matrix:computeMatrix(
                            viewProjectionMatrix,
                            cubeTranslation,
                            cubeXRotation,
                            cubeYRotation),
                u_colorMult:[1,0.5,0.5,1]
            }
            gl.useProgram(programInfo.program);
            twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
            twgl.setUniforms(programInfo, uniforms);
            twgl.drawBufferInfo(gl, bufferInfo);

            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
     
