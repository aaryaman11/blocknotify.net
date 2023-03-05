import { useEffect, useRef, useState } from "react";
import {
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Text,
  Input,
  Button,
  toast,
  useToast,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import axios from "axios";
import { useAccount, useSignMessage } from "wagmi";
import { verifyMessage } from "ethers/lib/utils.js";

function getMessageToSign(message: any) {
  return Buffer.from(message, "utf-8");
}

export default function Default(props: {
  startContent?: JSX.Element;
  endContent?: JSX.Element;
  name: string;
}) {
  const toast = useToast();
  const { address } = useAccount();
  const [numberSignature, setNumberSignature] = useState("");
  const [verifySignature, setVerifySignature] = useState("");
  const [validPhoneNumber, setValidPhoneNumber] = useState(false);

  const { startContent, endContent, name } = props;
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "secondaryGray.600";

  // handle phone number input
  const [phoneNumber, setPhoneNumber] = useState("");
  const handlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPhoneNumber(event.target.value);
  };

  // handling phone code input
  const [phoneCode, setPhoneCode] = useState("");
  const handlePhoneCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPhoneCode(event.target.value);
  };

  // sign message and check returned address for matching signed in one
  const recoveredNumberAddress = useRef<string>();
  const {
    data: phoneNumberData,
    isLoading: phoneNumberLoading,
    signMessage: signNumberMessage,
  } = useSignMessage({
    onSuccess(data, variables) {
      // Verify signature when sign message succeeds
      const address = verifyMessage(variables.message, data);
      recoveredNumberAddress.current = address;
    },
    onError(error) {
      toast({
        title: "Error signing message",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  // sign message and check returned address for matching signed in one
  const recoveredVerifyAddress = useRef<string>();
  const {
    data: phoneVerifyData,
    isLoading: phoneVerifyLoading,
    signMessage: signVerifyMessage,
  } = useSignMessage({
    onSuccess(data, variables) {
      // Verify signature when sign message succeeds
      const address = verifyMessage(variables.message, data);
      recoveredVerifyAddress.current = address;
    },
    onError(error) {
      toast({
        title: "Error signing message",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  // handle submitting signed message
  const handleSubmitPhone = () => {
    signNumberMessage({ message: phoneNumber ?? "" });
  };

  const handleSubmitVerify = () => {
    signVerifyMessage({ message: phoneCode ?? "" });
  };

  // TODO add ${env.BACKEND_URL}

  useEffect(() => {
    // make sure recovered address equals the connected address
    if (
      numberSignature &&
      numberSignature !== "" &&
      address === recoveredNumberAddress.current
    ) {
      axios
        .post(`/api/register`, {
          phone: phoneNumber,
          signature: numberSignature,
        })
        .then((res) => {
          // TODO: now what? we are registered? how do we switch the router from Register to Verify?
          // addMessage("Success! A code was sent to the phone number.", 'success')
          toast({
            title: "A code was sent to the phone number.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          // props.onReload("pending")
          // addMessage(<pre>{JSON.stringify(res, null, 4)}</pre>, 'primary')
          // TODO: figure out how to reload the app now... it doesn't auto-redirect them
          // ReactDOM.render(<App/>);
        })
        .catch((err) =>
          toast({
            title: "Something went wrong, code not sent",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        ); // milliseconds
    }
  }, [numberSignature]);

  useEffect(() => {
    const phoneRegex = /^\+[1-9]\d{1,14}$/; //  /^\d{10}$/; // Regex for 10 digit phone number
    if (phoneRegex.test(phoneNumber)) {
      setValidPhoneNumber(true);
    } else {
      setValidPhoneNumber(false);
    }
  }, [phoneNumber]);

  useEffect(() => {
    // make sure recovered address equals the connected address
    if (
      verifySignature &&
      verifySignature !== "" &&
      address === recoveredVerifyAddress.current
    ) {
      axios
        .post(`/api/verify`, {
          challenge: phoneCode,
          signature: verifySignature,
        })
        .then((res) => {
          // TODO: now what? we are registered? how do we switch the router from Register to Verify?
          // addMessage("Success! A code was sent to the phone number.", 'success')
          toast({
            title: "A code was sent to the phone number.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          // props.onReload("pending")
          // addMessage(<pre>{JSON.stringify(res, null, 4)}</pre>, 'primary')
          // TODO: figure out how to reload the app now... it doesn't auto-redirect them
          // ReactDOM.render(<App/>);
        })
        .catch((err) =>
          toast({
            title: "Something went wrong, verify not sent",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        ); // milliseconds
    }
  }, [verifySignature]);

  return (
    <Card py="15px">
      <Flex
        my="auto"
        h="100%"
        align={{ base: "center", xl: "start" }}
        justify={{ base: "center", xl: "center" }}
      >
        {startContent}

        <Flex flexDirection="column" ml={startContent ? "18px" : "0px"}>
          <Stat my="auto">
            <StatLabel
              lineHeight="100%"
              color={textColorSecondary}
              fontSize={{
                base: "md",
              }}
            >
              {name}
            </StatLabel>
          </Stat>

          <Flex flexDirection="column" mt="12px">
            <Stat>
              <StatLabel
                lineHeight="100%"
                color={textColorSecondary}
                fontSize={{
                  base: "sm",
                }}
              >
                Phone Number
              </StatLabel>
            </Stat>

            <Flex mt="6px">
              <Input value={phoneNumber} onChange={handlePhoneNumberChange} />
              <Button
                ml={2}
                colorScheme="green"
                onClick={handleSubmitPhone}
                isLoading={phoneNumberLoading}
              >
                Register
              </Button>
            </Flex>
          </Flex>

          <Flex flexDirection="column" mt="12px">
            <Stat>
              <StatLabel
                lineHeight="100%"
                color={textColorSecondary}
                fontSize={{
                  base: "sm",
                }}
              >
                Phone Code
              </StatLabel>
            </Stat>

            <Flex mt="6px">
              <Input
                value={phoneCode}
                onChange={handlePhoneCodeChange}
                disabled={
                  recoveredNumberAddress && verifySignature !== ""
                    ? false
                    : true
                }
              />
              <Button
                ml={2}
                colorScheme="blue"
                disabled={
                  recoveredNumberAddress && verifySignature !== ""
                    ? false
                    : true
                }
                onClick={handleSubmitVerify}
              >
                Verify
              </Button>
            </Flex>
          </Flex>
        </Flex>

        <Flex mt="auto" ml="auto" w="max-content">
          {endContent}
        </Flex>
      </Flex>
    </Card>
  );
}
