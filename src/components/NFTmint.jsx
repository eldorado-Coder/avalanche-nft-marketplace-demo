import React, { useState } from "react";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { PolygonCurrency } from "./Chains/Logos";
import {
  Form,
  Radio,
  Slider,
  Button,
  Upload,
  Rate,
  InputNumber,
  Input,
  Col,
  message
} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import TextArea from "antd/lib/input/TextArea";
import Moralis from "moralis";
// import { contractABI, contractAddress } from "../../contract";
import Web3 from 'web3'

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  // JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF
  const extension = file.type.split('/')[1]
  const validateExtension = extension === 'jpeg' || extension === 'mp4' || extension === 'png'|| extension === 'ogg' || extension === 'wav'
  if (!validateExtension) {
    message.error('You can only upload JPG/PNG/mp4/ogg/wav file!');
  }
  const isLt100M = file.size / 1024 / 1024 < 100;
  if (!isLt100M) {
    message.error('Image must smaller than 100MB!');
  }
  return validateExtension && isLt100M;
}

function NFTMint() {

  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("")
  const [price, setPrice] = useState(0)
  const [file, setFile] = useState(null);
  const { walletAddress } = useMoralisDapp();

  async function onFinish (values) {
    try {
      // Attempt to save image to IPFS
      const file1 = new Moralis.File(file.name, file);
      await file1.saveIPFS();
      const file1url = file1.ipfs();
      // Generate metadata and save to IPFS
      const metadata = {
        name,
        description,
        image: file1url,
      };
      const file2 = new Moralis.File(`${name}metadata.json`, {
        base64: Buffer.from(JSON.stringify(metadata)).toString("base64"),
      });
      await file2.saveIPFS();
      const metadataurl = file2.ipfs();
      // const contract = new Web3.eth.Contract(contractABI, contractAddress);
      // const response = await contract.methods
      //   .mint(metadataurl)
      //   .send(walletAddress);
      // const tokenId = response.events.Transfer.returnValues.tokenId;
      // alert(
      //   `NFT successfully minted. Contract address - ${contractAddress} and Token ID - ${tokenId}`
      // );
    } catch (err) {
      console.error(err);
      alert("An error occured!");
    }
  };

  async function listNFTForSale() {
    // const url = await uploadToIPFS()
    // const web3Modal = new Web3Modal()
    // const connection = await web3Modal.connect()
    // const provider = new ethers.providers.Web3Provider(connection)
    // const signer = provider.getSigner()

    // /* next, create the item */
    // const price = ethers.utils.parseUnits(formInput.price, 'ether')
    // let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    // let listingPrice = await contract.getListingPrice()
    // listingPrice = listingPrice.toString()
    // let transaction = await contract.createToken(url, price, { value: listingPrice })
    // await transaction.wait()
   
    // router.push('/')
  }
  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div className="mint-container">
      <h1>Create New Item</h1>
      <Form
        name="validate_other"
        {...formItemLayout}
        onFinish={() => onFinish()}
      >
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          beforeUpload={beforeUpload}
          onChange={handleChange}
          multiple
        >
          {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
        <Form.Item
          label="Name"
          name="Name"
          rules={[{ required: true, message: 'Please input your Name!' }]}
          extra="File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. Max size: 100 MB"
        >
          <Input value={name} onChange={(e)=> setName(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="price"
          name="price"
          rules={[{ required: true, message: 'Please input Price!' }]}
        >
          <InputNumber min={0} defaultValue={0} value={price} onChange={(value)=>setPrice(value)} />
        </Form.Item>
        <Form.Item
          label="Description"
          name="Description"
          rules={[{ required: true, message: 'Please input Description!' }]}
        >
          <TextArea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Provide a detailed description of the item" />
        </Form.Item>
        <Button onClick={listNFTForSale} type="primary" htmlType="submit">
          Create
        </Button>
      </Form>
    </div>

  );
}

export default NFTMint;
