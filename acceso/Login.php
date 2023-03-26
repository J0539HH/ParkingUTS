<?php

header('Content-Type: text/html; charset=utf-8');
session_start();
$idSesion = session_id();
if (!empty($idSesion)) {
    unset($_SESSION);
    session_destroy();
}
require '../lib/php/MensajeriaPhpMailer.php';

require '../lib/PHPMailer/src/Exception.php';
require '../lib/PHPMailer/src/SMTP.php';
require '../lib/PHPMailer/src/PHPMailer.php';
require_once "../clases/Framework.php";
require_once "../clases/integracion/MensajeriaTexto.php";

$miFramework = new FrameWork("NOMBREPROYECTO", "configuracion/config.cfg");

class Login extends InterfazBase {

    const VERIFICAR_LOGIN = 101;
    const ENVIAR_MENSAJE = 102;
    const RECUPERAR_PASSWORD = 103;
    const VALIDAR_OTP_USUARIO = 104;
    const CAMBIAR_CONTRA = 105;

    public function __construct(ArrayObject $args = NULL, FrameWork $frameWork = NULL) {
        parent::__construct($args, $frameWork);
        $accion = $this->getInt('accion');
        switch ($accion) {
            case Login::VERIFICAR_LOGIN: {
                    $this->verificarLogin();
                    break;
                }
            case Login::ENVIAR_MENSAJE: {
                    $this->enviarMensaje();
                    break;
                }
            case Login::RECUPERAR_PASSWORD: {
                    $this->RecuperarPass();
                    break;
                }
            case Login::VALIDAR_OTP_USUARIO: {
                    $this->validarOTPusuario();
                    break;
                }
            case Login::CAMBIAR_CONTRA: {
                    $this->cambiarPassword();
                    break;
                }
            default: {
                    echo json_encode($this->retorno);
                    break;
                }
        }
    }

    protected function RecuperarPass() {
        $usuario = $this->getString("usuario");
        $usuarioObj = new UsuariosCliente();
        try {
            $usuarioCargado = $usuarioObj->crearXLogin($usuario);
        } catch (Exception $ex) {
            throw new Exception("El usuario ingresado es incorrecto");
        }
        $idpersona = $usuarioCargado->getIdpersona();
        $personaCargada = Persona::crear($idpersona);
        $correo = $personaCargada->getEmail();
        if ($idpersona != 0) {
            $RN1 = mt_rand(0, 9);
            $RN2 = mt_rand(0, 9);
            $RN3 = mt_rand(0, 9);
            $RN4 = mt_rand(0, 9);
            $RN5 = mt_rand(0, 9);
            $RN6 = mt_rand(0, 9);
            $OTPrandom = $RN1 . "" . $RN2 . "" . $RN3 . "" . $RN4 . "" . $RN5 . "" . $RN6;
            $OTPCRYPT = (mb_convert_case(hash("sha256", $OTPrandom), MB_CASE_LOWER, "UTF-8"));
            $usuarioNew = new UsuariosCliente();
            $usuarioCargado = $usuarioNew->crearXLogin($usuario);
            $nombreUsuario = $personaCargada->getNombres() . "&nbsp;" . $personaCargada->getApellidos();
            $idUsuario = $usuarioCargado->getIdusuarioscliente();
            $usuarioCargado->actualizarOTP($OTPCRYPT, $idUsuario);
            $servicioMensajeriaCorreo = new MensajeriaPhpMailer();
            $Mensaje = "Hola! " . $nombreUsuario . " estamos restableciendo tu contraseña, por favor ingresa el siguiente número para validar tu usuario: <p style='font-weight: bold;color: #1664AB;'>" . $OTPrandom
                    . "</p><br> Si no pediste el reestablecimiento de la contraseña, probablemente alguien esta intentando acceder a tu cuenta!";
            $servicioMensajeriaCorreo->enviarMensaje($correo, "Restablecer contraseña ", $Mensaje);
            $this->retorno->idUsuario = $idUsuario;
            $this->retorno->OTPCRYPT = $OTPCRYPT;
        }
        $this->retorno->idPersona = $idpersona;
        $this->retorno->msg = "";
        echo json_encode($this->retorno);
    }

    protected function cambiarPassword() {
        $OTP = $this->getString("OTPingresado");
        $Usuario = $this->getString("usuario");
        $password = $this->getString("newPass");
        $NewPassword = (mb_convert_case(hash("sha256", $password), MB_CASE_UPPER, "UTF-8"));
        $UsuarioN = new UsuariosCliente();
        $UsuarioN1 = $UsuarioN->crearxUsuario($Usuario);
        $OTPinTable = $UsuarioN1->getOtp();
        if ($OTPinTable !== $OTP) {
            throw new Exception("Intentalo nuevamente!!");
        }
        $UsuarioN1->actualizarPass($Usuario, $NewPassword);
        $this->retorno->msg = "";
        echo json_encode($this->retorno);
    }

    protected function validarOTPusuario() {
        $OTP = $this->getString("OTPingresado");
        $Usuario = $this->getString("usuario");
        $UsuarioN = new UsuariosCliente();
        $UsuarioN1 = $UsuarioN->crearxUsuario($Usuario);
        $OTPinTable = $UsuarioN1->getOtp();

        if ($OTPinTable === $OTP) {
            $estado = true;
        } else {
            $estado = false;
        }
        $this->retorno->estado = $estado;
        $this->retorno->msg = "";
        echo json_encode($this->retorno);
    }

    protected function verificarLogin() {
        $password = $this->getString("password");
        $login = $this->getString("login");

        $fechaActual = new FechaHora();

        $_SESSION['iIDUserP'] = 0;
        $msg = "";
        try {
            $usuario = UsuariosCliente::crearXLogin($login);
            $estadoUsuario = $usuario->getEstado();
            if (!$usuario->verificarPassword(mb_convert_case(hash("sha256", $password), MB_CASE_UPPER, "UTF-8"))) {
                $auditoriaClase = new AuditoriaClaseCliente();
                $auditoriaClase->setIdtareacliente(Tarea::INICIO_SESION);
                $auditoriaClase->setIdaccionauditablecliente(AccionAuditable::Insercion);
                $auditoriaClase->setDescripcion("Intento de acceso fallido con el usuario $login");
                $auditoriaClase->setFecha($fechaActual);
                $auditoriaClase->guardarObjeto();

                $msg = "El nombre de usuario y/o contrase&ntilde;a no son v&aacute;lidos.";
            }
            $idUsuario = $usuario->getIdusuarioscliente();
            $idPerso = $usuario->getIdpersona();

            $Persona = Persona::crear($idPerso);
            $Celular = $Persona->getCelular();

            if (empty($idUsuario)) {
                throw new Exception("El identificador de usuario devuelto no es vv&aacute;lidos.");
            }
            if ($estadoUsuario === 'f') {
                throw new Exception("Su cuenta de usuario est&aacute; inactiva.");
            }

            $_SESSION['iIDUserP'] = $idUsuario;

            $auditoriaClase = new AuditoriaClaseCliente();
            $auditoriaClase->setIdtareacliente(Tarea::INICIO_SESION);
            $auditoriaClase->setIdaccionauditablecliente(AccionAuditable::Insercion);
            $auditoriaClase->setDescripcion("Ingreso exitoso a PREMIUM  para el usuario $login");
            $auditoriaClase->setFecha($fechaActual);
            $auditoriaClase->setIdusuariocliente($idUsuario);
            $auditoriaClase->guardarObjeto();
            $auditoriaEvento = new AuditoriaEventoCliente();
            $auditoriaEvento->setIdusuarioscliente($idUsuario);
            $auditoriaEvento->setIdeventoauditablecliente(EventoAuditable::ACCESO_EXITOSO_SISTEMA);
            $auditoriaEvento->setFecha($fechaActual);
            $auditoriaEvento->setDescripcion("Ingreso exitoso a PREMIUM  para el usuario " . $login);
            $auditoriaEvento->guardarObjeto($auditoriaClase);

            $vence = $this->getString("vencimiento");
            $venceT = $this->getString("tablaVencimiento");
            $RN1 = mt_rand(0, 9);
            $RN2 = mt_rand(0, 9);
            $RN3 = mt_rand(0, 9);
            $RN4 = mt_rand(0, 9);
            $OTPrandom = $RN1 . "" . $RN2 . "" . $RN3 . "" . $RN4;
            $this->retorno->login = true;
            $this->retorno->id = $idUsuario;
        } catch (Exception $exc) {

            $auditoriaClase = new AuditoriaClaseCliente();
            $auditoriaClase->setIdtareacliente(Tarea::INICIO_SESION);
            $auditoriaClase->setIdaccionauditablecliente(AccionAuditable::Insercion);
            $auditoriaClase->setDescripcion("Intento de acceso fallido con el usuario $login");
            $auditoriaClase->setFecha($fechaActual);
            $auditoriaClase->guardarObjeto();
            $this->retorno->login = false;
            $this->retorno->Invalido = true;
            $msg = "El nombre de usuario y/o contrase&ntilde;a son v&aacute;lidossss.";
        }
        if ($this->retorno->login == true) {
            Login::enviarMensaje($Celular, $vence, $OTPrandom, $idUsuario, $venceT);
            $usuario1 = UsuariosCliente::crearXLogin($login);
            $vencimiento = $usuario1->getVencimientootp();
            $otpCryp = $usuario1->getOtp();
            $this->retorno->vencimiento = $vencimiento;
            $this->retorno->OTPCHECK = $otpCryp;
        }
        $this->retorno->msg = "";

        $this->retorno->login = empty($msg);
        echo json_encode($this->retorno);
    }

    protected function enviarMensaje($destinatario, $vencimiento, $OTPn, $idUsuario, $venceT) {
        $Otpentabla = '$otp';
        $Vencimientoentabla = '$vencimientootp';
        $tarea1 = 1;
        $PlantillaMensaje = PlantillaMensaje::crearXTarea($tarea1);
        $plantillatarea1 = $PlantillaMensaje->getContenidosms();
        $mynewstring = str_replace($Otpentabla, $OTPn, $plantillatarea1);
        $mynewstring2 = str_replace($Vencimientoentabla, $vencimiento, $mynewstring);
        $mensajeEnviado = new MensajeriaTexto();
        $formatoMensaje = ($mynewstring2);
        $usuario = new UsuariosCliente();
        $usuarioObjeto = UsuariosCliente::crear($idUsuario);
        $IdPersona = $usuarioObjeto->getIdpersona();
        $personaObjeto = Persona::crear($IdPersona);
        $Celular = $personaObjeto->getCelular();
        $Celular = "+57" . $Celular;
        $MensajeWhatsapp = str_replace($Otpentabla, "*" . $OTPn . "*", $plantillatarea1);
        $MensajeWhatsapp1 = str_replace(", ", "\\n", $MensajeWhatsapp);
        $MensajeWhatsapp2 = str_replace($Vencimientoentabla, $vencimiento, $MensajeWhatsapp1);
        $VariableEntorno = new VariableEntorno;
        $ObjetoToken = $VariableEntorno::crear(21);
        $Token = $ObjetoToken->getValor();
        $ObjetoDevice = $VariableEntorno::crear(22);
        $Device = $ObjetoDevice->getValor();
        $ObjetoUrl = $VariableEntorno::crear(20);
        $UrlWassenger = $ObjetoUrl->getValor();
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => $UrlWassenger,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => "{\"phone\":\"$Celular\",\"message\":\"$MensajeWhatsapp2\",\"device\":\"$Device\"}",
            CURLOPT_HTTPHEADER => [
                "Content-Type: application/json",
                "Token: " . $Token . ""
            ],
        ]);
        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);
        try {
            $mensajeEnviado->enviarMensaje($destinatario, $formatoMensaje);
        } catch (ObjetoInexistenteException $ex) {
            
        }


        $OTPCRYPT = (mb_convert_case(hash("sha256", $OTPn), MB_CASE_LOWER, "UTF-8"));
        $usuario->actualizarOTP($OTPCRYPT, $idUsuario);
        $usuario->actualizarVencimiento($venceT, $idUsuario);
    }

}

$interfaz = new Login(new ArrayObject(array_merge($_POST, $_GET)), $miFramework);
$interfaz->cerrar(true);
