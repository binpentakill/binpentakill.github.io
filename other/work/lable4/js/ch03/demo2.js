"use strict";

var canvas;
var gl;

var theta = 0.0;
var thetaLoc;
var direction = 1;
var speed = 50;
function changeDir(){
	direction *= -1;
}

function initRotSquare(){
	canvas = document.getElementById( "rot-canvas" );
	gl = WebGLUtils.setupWebGL( canvas, "experimental-webgl" );
	if( !gl ){
		alert( "WebGL isn't available" );
	}



	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	var program = initShaders( gl, "rot-v-shader", "rot-f-shader" );
	gl.useProgram( program );

	var vertices = [
		 0,  1,  0,
		-1,  0,  0,
		 1,  0,  0,
		 0, -1,  0
	];

	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	thetaLoc = gl.getUniformLocation( program, "theta" );
	
	
	

	document.getElementById( "speedcon" ).onchange = function( event ){
		speed = 100 - event.target.value;
	}

	renderSquare();
}

function renderSquare(){
	gl.clear( gl.COLOR_BUFFER_BIT );
	
	// set uniform values
	theta += direction * 0.1;
	
	gl.uniform1f( thetaLoc, theta );
	gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    //gl.uniform1f(u_x_scale_loc, theta );  
	// update and render
	setTimeout( function(){ requestAnimFrame( renderSquare ); }, speed );
}
function GetQuad_Point(xcenter, ycenter, length) {
    let xMin = xcenter - length / 2;
    let yMin = ycenter - length / 2;
    let step = length / 20;
    //
    let res = [];
    let xidx = 0;
    let yidx = 0;
    for (xidx = 0; xidx != 20; xidx++) {
        for (yidx = 0; yidx != 20; yidx++) {
            res.push(
                xMin + xidx * step,
                yMin + yidx * step,
            );
        }
    }
    return res;
}

        var pointCanvas = document.getElementById('point'); // 我们的纸
        var gl = pointCanvas.getContext('webgl', { preserveDrawingBuffer: true }); // 我们的笔
        var pointData = GetQuad_Point(0, 0, 1);
        var pointCount = pointData.length / 2;
        var pointArray = new Float32Array(pointData);
        var buffer_id;
        buffer_id = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer_id);
        gl.bufferData(gl.ARRAY_BUFFER, pointArray, gl.STATIC_DRAW);
        //
        var vertex_shader_code = document.getElementById('vertex_shader').textContent;
        console.log(vertex_shader_code);
        var vertex_shader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertex_shader, vertex_shader_code);
        gl.compileShader(vertex_shader);
        //
        var fragment_shader_code = document.getElementById('fragment_shader').textContent;
        var fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragment_shader, fragment_shader_code);
        gl.compileShader(fragment_shader);
        //
        var program = gl.createProgram();
        gl.attachShader(program, vertex_shader);
        gl.attachShader(program, fragment_shader);
        gl.linkProgram(program);
        gl.useProgram(program);
        //
        var a_PointVertex = gl.getAttribLocation(program, 'a_PointVertex');
        gl.vertexAttribPointer(a_PointVertex, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_PointVertex);
        //


        var u_x_offset_loc = gl.getUniformLocation(program, "u_x_offset");
        var u_x_scale_loc = gl.getUniformLocation(program, "u_x_scale");
        var u_y_offset_loc = gl.getUniformLocation(program, "u_y_offset");
        var u_y_scale_loc = gl.getUniformLocation(program, "u_y_scale");
        var u_rotate_loc = gl.getUniformLocation(program, "u_rotate");

        var scaleDomX = document.getElementById("scalex");
        var scaleValueDomX = document.getElementById("scalevaluex");
        var scaleDomY = document.getElementById("scaley");
        var scaleValueDomY = document.getElementById("scalevaluey");
        var offsetDomX = document.getElementById("offsetx");
        var offsetValueDomX = document.getElementById("offsetvaluex");
        var offsetDomY = document.getElementById("offsety");
        var offsetValueDomY = document.getElementById("offsetvaluey");

        var rotateDom = document.getElementById("rotate");
        var rotateValueDom = document.getElementById("rotatevalue");
        function updatefunc() {
            gl.uniform1f(u_x_scale_loc, parseFloat(scaleDomX.value));
            gl.uniform1f(u_y_scale_loc, parseFloat(scaleDomY.value));

            gl.uniform1f(u_x_offset_loc, parseFloat(offsetDomX.value));
            gl.uniform1f(u_y_offset_loc, parseFloat(offsetDomY.value));

            gl.uniform1f(u_rotate_loc, parseFloat(rotateDom.value));

            scaleValueDomX.innerText = scaleDomX.value;
            offsetValueDomX.innerText = offsetDomX.value;
            scaleValueDomY.innerText = scaleDomY.value;
            offsetValueDomY.innerText = offsetDomY.value;
            rotateValueDom.innerText = rotateDom.value;

            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);

            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.drawArrays(gl.POINTS, 0, pointCount);
        }
        updatefunc();
    