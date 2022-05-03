import * as THREE from 'three';
import { PeppersGhostEffect } from '../PeppersGhostEffect.js';
import { GLTFLoader } from "../loaders/GLTFLoader.js";
import { DRACOLoader } from "../loaders/DRACOLoader.js";
import { OrbitControls } from '../controls/OrbitControls.js';
import { RoomEnvironment } from '../environments/RoomEnvironment.js';
import Stats from '../libs/stats.module.js';


let scroll = 0;



var socket = io();

socket.on("city", (data) => {
	var item = document.createElement('li');
	item.textContent = data;
	messages.appendChild(item);
	window.scrollTo(0, document.body.scrollHeight);
});



let container;
let camera, scene, renderer, effect;
let group;
init();
animate();

function init() {
	container = document.getElementById( 'container' );
	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
	scene = new THREE.Scene();
	group = new THREE.Group();

	let radius;
	let width;
	let height;
	let texture;
	let normal_texture;

	function createPlanet(radius, width, height, texture, normal_texture) {
	const moon = new THREE.Mesh(
        new THREE.SphereGeometry(radius, width, height),
        new THREE.MeshStandardMaterial({
				map: texture,
				normalMap: normal_texture
			})
			);
				return moon;
	}


	const planets = ['../models/sun.jpg', '../models/mercury.jpg', '../models/venus.jpg', '../models/earth.jpg', '../models/mars.jpg', '../models/jupiter.jpg', '../models/saturn.jpg', '../models/uranus.jpg', '../models/neptune.jpg', '../models/pluto.jpg', '../models/moon.jpg'];
			
					
				
				
	const PLANET_TEXTURE = new THREE.TextureLoader().load(planets[scroll]);
    const normalTexture = new THREE.TextureLoader().load('../models/normal.jpg');

	group.add(createPlanet(5, 64, 32, PLANET_TEXTURE, normalTexture));
	scene.add( group );

				// Cube

	const geometry = new THREE.BoxGeometry().toNonIndexed(); // ensure unique vertices for each triangle

	const position = geometry.attributes.position;
	const colors = [];
	const color = new THREE.Color();

	const material = new THREE.MeshBasicMaterial( { vertexColors: true } );

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	scene.background = new THREE.Color( 0x00000 );
	renderer.outputEncoding = THREE.sRGBEncoding;
	container.appendChild( renderer.domElement );

	const pmremGenerator = new THREE.PMREMGenerator( renderer );
    scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;



	effect = new PeppersGhostEffect( renderer );
	effect.setSize( window.innerWidth, window.innerHeight );
	effect.cameraDistance = 15;

	window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	effect.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

	requestAnimationFrame( animate );

		group.rotation.y += 0.0008;

		effect.render( scene, camera );

}