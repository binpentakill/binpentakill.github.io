"use strict";

const { vec3 } = glMatrix;

var canvas1;
var canvas2;
var gl1;
var gl2;

var points1 = [];
var points2 = [];

/** Parameters */
var numTimesToSubdivide = 4;
var theta1=0;
var theta2=0;
var twist=false;

var radius=1.0;

//左边部分
function submit1(){
    theta1 = document.getElementById('leftCount').value;

	canvas1 = document.getElementById( "gl-canvas" );

	gl1 = WebGLUtils.setupWebGL( canvas1 );
	if( !gl1 ){
		alert( "WebGL isn't available" );
	}

	// initialise data for Sierpinski gasket

    // first, initialise the corners of the gasket with three points.
    // R=0.6, Theta = 90, 210, -30
	var vertices = [
        radius * Math.cos(90 * Math.PI / 180.0), radius * Math.sin(90 * Math.PI / 180.0),  0,
        radius * Math.cos(210 * Math.PI / 180.0), radius * Math.sin(210 * Math.PI / 180.0),  0,
        radius * Math.cos(-30 * Math.PI / 180.0), radius * Math.sin(-30 * Math.PI / 180.0),  0
	];

	// var u = vec3.create();
	// vec3.set( u, -1, -1, 0 );
	var u = vec3.fromValues( vertices[0], vertices[1], vertices[2] );
	// var v = vec3.create();
	// vec3.set( v, 0, 1, 0 );
	var v = vec3.fromValues( vertices[3], vertices[4], vertices[5] );
	// var w = vec3.create();
	// vec3.set( w, 1, -1, 0 );
	var w = vec3.fromValues( vertices[6], vertices[7], vertices[8] );

	divideTriangle1( u, v, w, numTimesToSubdivide );

	// configure webgl
	gl1.viewport( 0, 0, canvas1.width, canvas1.height );
	gl1.clearColor( 1.0, 1.0, 1.0, 1.0 );

	// load shaders and initialise attribute buffers
	var program1 = initShaders( gl1, "vertex-shader", "fragment-shader" );
	gl1.useProgram( program1 );

	// load data into gpu
	var vertexBuffer = gl1.createBuffer();
	gl1.bindBuffer( gl1.ARRAY_BUFFER, vertexBuffer );
	gl1.bufferData( gl1.ARRAY_BUFFER, new Float32Array( points1 ), gl1.STATIC_DRAW );

	// associate out shader variables with data buffer
	var vPosition = gl1.getAttribLocation( program1, "vPosition" );
	gl1.vertexAttribPointer( vPosition, 3, gl1.FLOAT, false, 0, 0 );
	gl1.enableVertexAttribArray( vPosition );

	renderTriangles1();
};


//右边部分
function submit2(){
    theta2 = document.getElementById('rightCount').value;
    
	canvas2 = document.getElementById( "gl-canvas2" );

	gl2 = WebGLUtils.setupWebGL( canvas2 );
	if( !gl2 ){
		alert( "WebGL isn't available" );
	}

	// initialise data for Sierpinski gasket

    // first, initialise the corners of the gasket with three points.
    // R=0.6, Theta = 90, 210, -30
	var vertices = [
        radius * Math.cos(90 * Math.PI / 180.0), radius * Math.sin(90 * Math.PI / 180.0),  0,
        radius * Math.cos(210 * Math.PI / 180.0), radius * Math.sin(210 * Math.PI / 180.0),  0,
        radius * Math.cos(-30 * Math.PI / 180.0), radius * Math.sin(-30 * Math.PI / 180.0),  0
	];

	// var u = vec3.create();
	// vec3.set( u, -1, -1, 0 );
	var u = vec3.fromValues( vertices[0], vertices[1], vertices[2] );
	// var v = vec3.create();
	// vec3.set( v, 0, 1, 0 );
	var v = vec3.fromValues( vertices[3], vertices[4], vertices[5] );
	// var w = vec3.create();
	// vec3.set( w, 1, -1, 0 );
	var w = vec3.fromValues( vertices[6], vertices[7], vertices[8] );

	divideTriangle2( u, v, w, numTimesToSubdivide );

	// configure webgl
	gl2.viewport( 0, 0, canvas2.width, canvas2.height );
	gl2.clearColor( 1.0, 1.0, 1.0, 1.0 );

	// load shaders and initialise attribute buffers
	var program2 = initShaders( gl2, "vertex-shader", "fragment-shader" );
	gl2.useProgram( program2 );

	// load data into gpu
	var vertexBuffer = gl2.createBuffer();
	gl2.bindBuffer( gl2.ARRAY_BUFFER, vertexBuffer );
	gl2.bufferData( gl2.ARRAY_BUFFER, new Float32Array( points2 ), gl2.STATIC_DRAW );

	// associate out shader variables with data buffer
	var vPosition = gl2.getAttribLocation( program2, "vPosition" );
	gl2.vertexAttribPointer( vPosition, 3, gl2.FLOAT, false, 0, 0 );
	gl2.enableVertexAttribArray( vPosition );

	renderTriangles2();
};

function tessellaTriangle1( a, b, c ){
    //var k;
    var zerovec3 = vec3.create();
    vec3.zero( zerovec3 );
    var radian = theta1 * Math.PI / 180.0;
    
    var a_new = vec3.create();
    var b_new = vec3.create();
    var c_new = vec3.create();

    if( twist == false ){
        vec3.rotateZ( a_new, a, zerovec3, radian );
        vec3.rotateZ( b_new, b, zerovec3, radian );
        vec3.rotateZ( c_new, c, zerovec3, radian );
        
        points1.push( a_new[0], a_new[1], a_new[2] );
        points1.push( b_new[0], b_new[1], b_new[2] );
        points1.push( b_new[0], b_new[1], b_new[2] );
        points1.push( c_new[0], c_new[1], c_new[2] );
        points1.push( c_new[0], c_new[1], c_new[2] );
        points1.push( a_new[0], a_new[1], a_new[2] );
    }else{
        var d_a = Math.sqrt( a[0] * a[0] + a[1] * a[1] );
        var d_b = Math.sqrt( b[0] * b[0] + b[1] * b[1] );
        var d_c = Math.sqrt( c[0] * c[0] + c[1] * c[1] );

        vec3.set( a_new, a[0] * Math.cos(d_a * radian) - a[1] * Math.sin( d_a * radian ), 
            a[0] * Math.sin( d_a * radian ) + a[1] * Math.cos( d_a * radian ), 0 );
        vec3.set(b_new, b[0] * Math.cos(d_b * radian) - b[1] * Math.sin(d_b * radian),
            b[0] * Math.sin(d_b * radian) + b[1] * Math.cos(d_b * radian), 0);
        vec3.set(c_new, c[0] * Math.cos(d_c * radian) - c[1] * Math.sin(d_c * radian),
            c[0] * Math.sin(d_c * radian) + c[1] * Math.cos(d_c * radian), 0);
        
        points1.push(a_new[0], a_new[1], a_new[2]);
        points1.push(b_new[0], b_new[1], b_new[2]);
        points1.push(b_new[0], b_new[1], b_new[2]);
        points1.push(c_new[0], c_new[1], c_new[2]);
        points1.push(c_new[0], c_new[1], c_new[2]);
        points1.push(a_new[0], a_new[1], a_new[2]);
    
    }
}

function tessellaTriangle2( a, b, c ){
    //var k;
    var zerovec3 = vec3.create();
    vec3.zero( zerovec3 );
    var radian = theta2 * Math.PI / 180.0;
    
    var a_new = vec3.create();
    var b_new = vec3.create();
    var c_new = vec3.create();

    if( twist == false ){
        vec3.rotateZ( a_new, a, zerovec3, radian );
        vec3.rotateZ( b_new, b, zerovec3, radian );
        vec3.rotateZ( c_new, c, zerovec3, radian );
        
        points2.push( a_new[0], a_new[1], a_new[2] );
        points2.push( b_new[0], b_new[1], b_new[2] );
        points2.push( b_new[0], b_new[1], b_new[2] );
        points2.push( c_new[0], c_new[1], c_new[2] );
        points2.push( c_new[0], c_new[1], c_new[2] );
        points2.push( a_new[0], a_new[1], a_new[2] );
    }else{
        var d_a = Math.sqrt( a[0] * a[0] + a[1] * a[1] );
        var d_b = Math.sqrt( b[0] * b[0] + b[1] * b[1] );
        var d_c = Math.sqrt( c[0] * c[0] + c[1] * c[1] );

        vec3.set( a_new, a[0] * Math.cos(d_a * radian) - a[1] * Math.sin( d_a * radian ), 
            a[0] * Math.sin( d_a * radian ) + a[1] * Math.cos( d_a * radian ), 0 );
        vec3.set(b_new, b[0] * Math.cos(d_b * radian) - b[1] * Math.sin(d_b * radian),
            b[0] * Math.sin(d_b * radian) + b[1] * Math.cos(d_b * radian), 0);
        vec3.set(c_new, c[0] * Math.cos(d_c * radian) - c[1] * Math.sin(d_c * radian),
            c[0] * Math.sin(d_c * radian) + c[1] * Math.cos(d_c * radian), 0);
        
        points2.push(a_new[0], a_new[1], a_new[2]);
        points2.push(b_new[0], b_new[1], b_new[2]);
        points2.push(b_new[0], b_new[1], b_new[2]);
        points2.push(c_new[0], c_new[1], c_new[2]);
        points2.push(c_new[0], c_new[1], c_new[2]);
        points2.push(a_new[0], a_new[1], a_new[2]);
    
    }
}

function divideTriangle1( a, b, c, count ){
	// check for end of recursion
	if( count == 0 ){
		tessellaTriangle1( a, b, c );
	}else{
		var ab = vec3.create();
		vec3.lerp( ab, a, b, 0.5 );
		var bc = vec3.create();
		vec3.lerp( bc, b, c, 0.5 );
		var ca = vec3.create();
		vec3.lerp( ca, c, a, 0.5 );

		// three new triangles
		divideTriangle1( a, ab, ca, count-1 );
		divideTriangle1( ab, b, bc, count-1 );
        divideTriangle1( ca, bc, c, count-1 );
        divideTriangle1( ab, bc, ca, count-1 );
	}
}

function divideTriangle2( a, b, c, count ){
	// check for end of recursion
	if( count == 0 ){
		tessellaTriangle2( a, b, c );
	}else{
		var ab = vec3.create();
		vec3.lerp( ab, a, b, 0.5 );
		var bc = vec3.create();
		vec3.lerp( bc, b, c, 0.5 );
		var ca = vec3.create();
		vec3.lerp( ca, c, a, 0.5 );

		// three new triangles
		divideTriangle2( a, ab, ca, count-1 );
		divideTriangle2( ab, b, bc, count-1 );
        divideTriangle2( ca, bc, c, count-1 );
        divideTriangle2( ab, bc, ca, count-1 );
	}
}

function renderTriangles1(){
	gl1.clear( gl1.COLOR_BUFFER_BIT );
	gl1.drawArrays( gl1.LINES, 0, points1.length/3 );
}

function renderTriangles2(){
	gl2.clear( gl2.COLOR_BUFFER_BIT );
	gl2.drawArrays( gl2.LINES, 0, points2.length/3);
}